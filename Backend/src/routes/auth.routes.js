const router = require("express").Router();
const {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
  changePassword,
  updateProfile,
} = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} = require("../validators");

// ─── Public ───────────────────────────────────────────────
router.post("/register", registerValidator, register);
router.post("/login",    loginValidator,    login);
router.post("/refresh-token", refreshAccessToken);

// ─── Protected ────────────────────────────────────────────
router.use(authenticate); // all routes below require auth

router.post("/logout",           logout);
router.get("/me",                getMe);
router.patch("/me",              updateProfile);
router.patch("/change-password", changePasswordValidator, changePassword);

module.exports = router;