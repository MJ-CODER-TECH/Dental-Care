const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const { ApiError, ApiResponse, asyncHandler } = require("../utils/apiHelpers");
const logger = require("../utils/logger");

// ─── Cookie Options ───────────────────────────────────────
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const generateAndSetTokens = async (user, res) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  res
    .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 30 * 24 * 60 * 60 * 1000 });

  return { accessToken, refreshToken };
};

// ─── Register ─────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    const field = existing.email === email ? "Email" : "Phone number";
    throw new ApiError(StatusCodes.CONFLICT, `${field} already registered`);
  }

  // Only admin can create dentist/admin/receptionist
  const allowedRole =
    req.user?.role === "admin" ? role || "patient" : "patient";

  const user = await User.create({ name, email, phone, password, role: allowedRole });
  const { accessToken, refreshToken } = await generateAndSetTokens(user, res);

  logger.info(`New user registered: ${email} [${allowedRole}]`);

  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, {
      user: user.toSafeObject(),
      accessToken,
      refreshToken,
    }, "Registration successful")
  );
});

// ─── Login ────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Account deactivated. Contact admin.");
  }

  const { accessToken, refreshToken } = await generateAndSetTokens(user, res);
  logger.info(`User logged in: ${email}`);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      user: user.toSafeObject(),
      accessToken,
      refreshToken,
    }, "Login successful")
  );
});

// ─── Logout ───────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {}, "Logged out successfully")
  );
});

// ─── Refresh Access Token ─────────────────────────────────
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token required");
  }

  let decoded;
  try {
    decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== incomingToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token revoked or mismatch");
  }

  const { accessToken, refreshToken } = await generateAndSetTokens(user, res);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { accessToken, refreshToken }, "Token refreshed")
  );
});

// ─── Get Current User (Me) ────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { user: user.toSafeObject() }, "Profile fetched")
  );
});

// ─── Change Password ──────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Current password is incorrect");
  }

  user.password = newPassword;
  // Invalidate all existing sessions
  user.refreshToken = undefined;
  await user.save();

  res.clearCookie("accessToken", cookieOptions).clearCookie("refreshToken", cookieOptions);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {}, "Password changed. Please login again.")
  );
});

// ─── Update Profile ───────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ["name", "phone", "dateOfBirth", "gender", "address", "medicalHistory"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { user: user.toSafeObject() }, "Profile updated")
  );
});

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
  changePassword,
  updateProfile,
};