const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { ApiError, asyncHandler } = require("../utils/apiHelpers");
const { StatusCodes } = require("http-status-codes");

// ─── Verify JWT Access Token ──────────────────────────────
const authenticate = asyncHandler(async (req, _res, next) => {
  let token;

  // Support both Authorization header and httpOnly cookie
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Access token required");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token expired. Please login again.");
    }
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid token");
  }

  const user = await User.findById(decoded.id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User no longer exists");
  }

  if (!user.isActive) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Your account has been deactivated. Contact admin.");
  }

  req.user = user;
  next();
});

// ─── Role-Based Access Control ────────────────────────────
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        `Access denied. Required role(s): ${roles.join(", ")}`
      );
    }
    next();
  };
};

// ─── Self or Admin check ──────────────────────────────────
// Patient can access their own data; admin/dentist can access any
const selfOrAdmin = asyncHandler(async (req, _res, next) => {
  const requestedId = req.params.id || req.params.userId;
  const isOwner = req.user._id.toString() === requestedId;
  const isPrivileged = ["admin", "dentist", "receptionist"].includes(req.user.role);

  if (!isOwner && !isPrivileged) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You can only access your own data");
  }
  next();
});

module.exports = { authenticate, authorize, selfOrAdmin };