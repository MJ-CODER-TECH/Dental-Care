const router = require("express").Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getCategories,
} = require("../controllers/service.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { createServiceValidator, mongoIdValidator } = require("../validators");

// ─── Public (no auth needed) ──────────────────────────────
router.get("/categories", getCategories);
router.get("/",           getAllServices);
router.get("/:id",        mongoIdValidator(), getServiceById);

// ─── Protected: Admin only for CUD operations ─────────────
router.use(authenticate);

router.post(
  "/",
  authorize("admin"),
  createServiceValidator,
  createService
);

router.put(
  "/:id",
  authorize("admin"),
  mongoIdValidator(),
  updateService
);

router.delete(
  "/:id",
  authorize("admin"),
  mongoIdValidator(),
  deleteService
);

module.exports = router;