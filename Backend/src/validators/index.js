const { body, param, query, validationResult } = require("express-validator");
const { ApiError } = require("../utils/apiHelpers");
const { StatusCodes } = require("http-status-codes");

// ─── Run Validation & Collect Errors ─────────────────────
const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "Validation failed", messages);
  }
  next();
};

// ─── Auth Validators ──────────────────────────────────────
const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 60 }).withMessage("Name must be 2–60 characters"),

  body("email").normalizeEmail().isEmail().withMessage("Valid email is required"),

  body("phone").trim().matches(/^[6-9]\d{9}$/).withMessage("Valid 10-digit Indian phone required"),

  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and a number"),

  body("role")
    .optional()
    .isIn(["patient", "dentist", "receptionist"])
    .withMessage("Invalid role"),

  validate,
];

const loginValidator = [
  body("email").normalizeEmail().isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and a number"),
  validate,
];

// ─── Appointment Validators ───────────────────────────────
const createAppointmentValidator = [
  body("dentist").isMongoId().withMessage("Valid dentist ID required"),
  body("service").isMongoId().withMessage("Valid service ID required"),
  body("appointmentDate").isISO8601().withMessage("Valid date required (ISO8601)"),
  body("timeSlot.start")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Start time must be HH:MM"),
  body("timeSlot.end")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("End time must be HH:MM"),
  body("symptoms").optional().isLength({ max: 500 }).withMessage("Symptoms too long"),
  validate,
];

const updateAppointmentStatusValidator = [
  param("id").isMongoId().withMessage("Valid appointment ID required"),
  body("status")
    .isIn(["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show", "rescheduled"])
    .withMessage("Invalid status"),
  body("reason").optional().isLength({ max: 300 }).withMessage("Reason too long"),
  validate,
];

// ─── Service Validators ───────────────────────────────────
const createServiceValidator = [
  body("name").trim().notEmpty().withMessage("Service name is required")
    .isLength({ max: 100 }).withMessage("Name too long"),

  body("category")
    .isIn(["preventive", "restorative", "cosmetic", "orthodontic", "surgical", "pediatric", "emergency", "diagnostic"])
    .withMessage("Invalid category"),

  body("description").trim().notEmpty().withMessage("Description is required")
    .isLength({ max: 1000 }).withMessage("Description too long"),

  body("duration").isInt({ min: 5, max: 480 }).withMessage("Duration must be 5–480 minutes"),

  body("price.base").isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  validate,
];

// ─── MongoId param validator ──────────────────────────────
const mongoIdValidator = (paramName = "id") => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  createAppointmentValidator,
  updateAppointmentStatusValidator,
  createServiceValidator,
  mongoIdValidator,
};