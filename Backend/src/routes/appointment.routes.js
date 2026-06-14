const router = require("express").Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  addNote,
  deleteAppointment,
  checkAvailability,
} = require("../controllers/appointment.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const {
  createAppointmentValidator,
  updateAppointmentStatusValidator,
  mongoIdValidator,
} = require("../validators");

// All appointment routes require authentication
router.use(authenticate);

// ─── Public to all authenticated users ───────────────────
router.get("/availability", checkAvailability);
router.get("/",             getAllAppointments);
router.get("/:id",          mongoIdValidator(), getAppointmentById);

// ─── Patient + Staff can book ─────────────────────────────
router.post(
  "/",
  authorize("patient", "admin", "receptionist"),
  createAppointmentValidator,
  createAppointment
);

// ─── Status update: staff + patient (with restrictions in controller) ─
router.patch(
  "/:id/status",
  updateAppointmentStatusValidator,
  updateAppointmentStatus
);

// ─── Notes: dentist, admin, receptionist ─────────────────
router.post(
  "/:id/notes",
  authorize("dentist", "admin", "receptionist"),
  mongoIdValidator(),
  addNote
);

// ─── Delete: admin only ───────────────────────────────────
router.delete(
  "/:id",
  authorize("admin"),
  mongoIdValidator(),
  deleteAppointment
);

module.exports = router;