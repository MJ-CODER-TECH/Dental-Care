const router = require("express").Router();

const {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getFeaturedBlogs,
  getCategories,
} = require("../controllers/blog.controller");

const { authenticate, authorize } = require("../middlewares/auth.middleware");

const {
  createBlogValidator,
  updateBlogValidator,
  mongoIdValidator,
} = require("../validators");

const upload = require("../middlewares/upload.middleware");

// ───────────────────────────────────────────────
// Public Routes
// ───────────────────────────────────────────────

router.get("/", getAllBlogs);

router.get("/featured", getFeaturedBlogs);

router.get("/categories", getCategories);

router.get("/:slug", getBlogBySlug);

// ───────────────────────────────────────────────
// Protected Routes
// Admin Only
// ───────────────────────────────────────────────

router.use(authenticate);

router.post(
  "/",
  authorize("admin"),
  upload.single("image"),
  createBlogValidator,
  createBlog
);

router.put(
  "/:id",
  authorize("admin"),
  upload.single("image"),
  mongoIdValidator(),
  updateBlogValidator,
  updateBlog
);

router.patch(
  "/:id/publish",
  authorize("admin"),
  mongoIdValidator(),
  publishBlog
);

router.patch(
  "/:id/unpublish",
  authorize("admin"),
  mongoIdValidator(),
  unpublishBlog
);

router.delete(
  "/:id",
  authorize("admin"),
  mongoIdValidator(),
  deleteBlog
);

module.exports = router;