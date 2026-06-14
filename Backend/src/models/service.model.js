const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "preventive",
          "restorative",
          "cosmetic",
          "orthodontic",
          "surgical",
          "pediatric",
          "emergency",
          "diagnostic",
        ],
        message: "Invalid service category",
      },
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },

    duration: {
      // in minutes
      type: Number,
      required: [true, "Duration is required"],
      min: [5, "Minimum duration is 5 minutes"],
      max: [480, "Maximum duration is 480 minutes (8 hours)"],
    },

    price: {
      base: {
        type: Number,
        required: [true, "Base price is required"],
        min: [0, "Price cannot be negative"],
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    requiresAnesthesia: {
      type: Boolean,
      default: false,
    },

    followUpRequired: {
      type: Boolean,
      default: false,
    },

    followUpDays: {
      type: Number,
      default: null,
    },

    availableFor: {
      type: [String],
      enum: ["adult", "child", "senior"],
      default: ["adult", "child", "senior"],
    },

    image: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ slug: 1 });
serviceSchema.index({ name: "text", description: "text" }); // text search

// ─── Auto-generate slug from name ─────────────────────────
serviceSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// ─── Virtual: price with GST (18%) ────────────────────────
serviceSchema.virtual("priceWithGST").get(function () {
  return Math.round(this.price.base * 1.18);
});

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;