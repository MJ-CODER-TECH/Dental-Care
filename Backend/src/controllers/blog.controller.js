const { StatusCodes } = require("http-status-codes");
const Blog = require("../models/blog.model");
const {
  ApiError,
  ApiResponse,
  asyncHandler,
} = require("../utils/apiHelpers");

const {
  uploadImage,
  deleteImage,
  replaceImage,
} = require("../utils/cloudinary");

// ─────────────────────────────────────────────────────────────
// CREATE BLOG
// POST /api/v1/blogs
// Admin Only
// ─────────────────────────────────────────────────────────────

const createBlog = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    excerpt,
    content,
    tags,
    metaTitle,
    metaDescription,
    isFeatured,
    status,
  } = req.body;

  // Check duplicate title
  const existing = await Blog.findOne({
    title: title.trim(),
    isActive: true,
  });

  if (existing) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Blog with this title already exists"
    );
  }

  // Upload image to Cloudinary
  let image = {
    url: null,
    public_id: null,
  };

  if (req.file) {
    const uploaded = await uploadImage(
  req.file,
  "blogs"
);

image = {
  url: uploaded.url,
  public_id: uploaded.publicId,
};
  }

  // Create blog
  const blog = await Blog.create({
    title,
    category,
    excerpt,
    content,
    tags,
    metaTitle,
    metaDescription,
    isFeatured,
    status,
    image,
    author: req.user._id,
  });

  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(
      StatusCodes.CREATED,
      { blog },
      "Blog created successfully"
    )
  );
});






// ─────────────────────────────────────────────────────────────
// GET ALL BLOGS
// GET /api/v1/blogs
// Public
// ─────────────────────────────────────────────────────────────

const getAllBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = {
    isActive: true,
    status: "published",
  };

  // Category Filter
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Featured Filter
  if (req.query.featured === "true") {
    filter.isFeatured = true;
  }

  // Search
  if (req.query.search) {
    filter.$text = {
      $search: req.query.search,
    };
  }

  const sortBy = req.query.sortBy || "-publishedAt";

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .populate("author", "name email")
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),

    Blog.countDocuments(filter),
  ]);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      {
        blogs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
      "Blogs fetched successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────
// GET BLOG BY SLUG
// GET /api/v1/blogs/:slug
// Public
// ─────────────────────────────────────────────────────────────

const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    status: "published",
    isActive: true,
  }).populate("author", "name email");

  if (!blog) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Blog not found"
    );
  }

  // Increase View Count
  blog.views += 1;

  await blog.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      {
        blog,
      },
      "Blog fetched successfully"
    )
  );
});



// ─────────────────────────────────────────────────────────────
// UPDATE BLOG
// PUT /api/v1/blogs/:id
// Admin Only
// ─────────────────────────────────────────────────────────────

const updateBlog = asyncHandler(async (req, res) => {

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Blog not found"
    );
  }

  // Replace Image
 if (req.file) {

  const uploaded = await replaceImage(
    blog.image?.public_id,
    req.file,
    "blogs"
  );

  blog.image = {
    url: uploaded.url,
    public_id: uploaded.publicId,
  };
}   

  // Allowed fields
  const allowedUpdates = [
    "title",
    "category",
    "excerpt",
    "content",
    "tags",
    "metaTitle",
    "metaDescription",
    "isFeatured",
    "status",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      blog[field] = req.body[field];
    }
  });

  await blog.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      { blog },
      "Blog updated successfully"
    )
  );
});


// ─────────────────────────────────────────────────────────────
// DELETE BLOG
// DELETE /api/v1/blogs/:id
// Admin Only
// ─────────────────────────────────────────────────────────────

const deleteBlog = asyncHandler(async (req, res) => {

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Blog not found"
    );
  }

  // Delete image from Cloudinary
  if (blog.image?.public_id) {
await deleteImage(blog.image.public_id);  }

  // Soft Delete
  blog.isActive = false;

  await blog.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      null,
      "Blog deleted successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────
// PUBLISH BLOG
// PATCH /api/v1/blogs/:id/publish
// Admin Only
// ─────────────────────────────────────────────────────────────

const publishBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Blog not found"
    );
  }

  blog.status = "published";
  blog.publishedAt = new Date();

  await blog.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      { blog },
      "Blog published successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────
// UNPUBLISH BLOG
// PATCH /api/v1/blogs/:id/unpublish
// Admin Only
// ─────────────────────────────────────────────────────────────

const unpublishBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Blog not found"
    );
  }

  blog.status = "draft";
  blog.publishedAt = null;

  await blog.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      { blog },
      "Blog unpublished successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────
// GET FEATURED BLOGS
// GET /api/v1/blogs/featured
// Public
// ─────────────────────────────────────────────────────────────

const getFeaturedBlogs = asyncHandler(async (_req, res) => {
  const blogs = await Blog.find({
    isFeatured: true,
    isActive: true,
    status: "published",
  })
    .populate("author", "name")
    .sort("-publishedAt")
    .limit(6)
    .lean();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      { blogs },
      "Featured blogs fetched successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────
// GET BLOG CATEGORIES
// GET /api/v1/blogs/categories
// Public
// ─────────────────────────────────────────────────────────────

const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Blog.distinct("category", {
    isActive: true,
  });

  return res.status(StatusCodes.OK).json(
    new ApiResponse(
      StatusCodes.OK,
      { categories },
      "Categories fetched successfully"
    )
  );
});

// ─────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  getFeaturedBlogs,
  getCategories,
};