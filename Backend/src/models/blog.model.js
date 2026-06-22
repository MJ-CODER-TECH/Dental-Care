const mongoose = require("mongoose");

// ─── Blog Schema ──────────────────────────────────────────
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      unique: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
    },

    image: {
  url: {
    type: String,
    default: null,
  },
  public_id: {
    type: String,
    default: null,
  },
},

    category: {
      type: String,
      required: true,
      enum: [
        "Dental Tips",
        "Oral Hygiene",
        "Root Canal",
        "Dental Implants",
        "Braces",
        "Teeth Whitening",
        "Kids Dentistry",
        "Emergency Care",
        "Cosmetic Dentistry",
        "General",
      ],
    },

    tags: {
      type: [String],
      default: [],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    readTime: {
      type: Number,
      default: 1,
    },

    seoTitle: {
      type: String,
      maxlength: 160,
    },

    seoDescription: {
      type: String,
      maxlength: 300,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────
blogSchema.index({ category: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ isFeatured: 1 });
blogSchema.index({
  title: "text",
  excerpt: "text",
  content: "text",
});

// ─── Generate Slug + Read Time ────────────────────────────
blogSchema.pre("save", function () {

  // Generate slug
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Calculate read time
  if (this.isModified("content")) {
    const words = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(words / 200));
  }

  // Auto set publish date
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
});

// ─── Virtual ──────────────────────────────────────────────
blogSchema.virtual("url").get(function () {
  return `/blogs/${this.slug}`;
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;