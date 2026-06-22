const router = require("express").Router();

const {
  createReview,
  getAllReviews,
  getDentistReviews,
  getServiceReviews,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  replyReview,
  getRatingStats,
} = require("../controllers/review.controller");

const {
  authenticate,
  authorize,
} = require("../middlewares/auth.middleware");

const {
  createReviewValidator,
  updateReviewValidator,
  replyReviewValidator,
  mongoIdValidator,
} = require("../validators");

// ─────────────────────────────────────────────
// Public Routes
// ─────────────────────────────────────────────

// All approved reviews
router.get("/", getAllReviews);

// Reviews of a Dentist
router.get(
  "/dentist/:dentistId",
  mongoIdValidator("dentistId"),
  getDentistReviews
);

// Reviews of a Service
router.get(
  "/service/:serviceId",
  mongoIdValidator("serviceId"),
  getServiceReviews
);

// Rating statistics
router.get(
  "/stats/:dentistId",
  mongoIdValidator("dentistId"),
  getRatingStats
);

// ─────────────────────────────────────────────
// Protected Routes
// ─────────────────────────────────────────────

router.use(authenticate);

// Create Review (Patient)
router.post(
  "/",
  authorize("patient"),
  createReviewValidator,
  createReview
);

// Update Own Review (Patient)
router.put(
  "/:id",
  authorize("patient"),
  mongoIdValidator(),
  updateReviewValidator,
  updateReview
);

// Delete Own Review (Patient/Admin)
router.delete(
  "/:id",
  authorize("patient", "admin"),
  mongoIdValidator(),
  deleteReview
);

// Dentist Reply
router.patch(
  "/:id/reply",
  authorize("dentist", "admin"),
  mongoIdValidator(),
  replyReviewValidator,
  replyReview
);

// Admin Approve
router.patch(
  "/:id/approve",
  authorize("admin"),
  mongoIdValidator(),
  approveReview
);

// Admin Reject
router.patch(
  "/:id/reject",
  authorize("admin"),
  mongoIdValidator(),
  rejectReview
);

module.exports = router;