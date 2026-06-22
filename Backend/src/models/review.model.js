const mongoose = require("mongoose");

// ─────────────────────────────────────────────
// Review Schema
// ─────────────────────────────────────────────

const reviewSchema = new mongoose.Schema(
  {
    // Patient who wrote the review
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
    },

    // Appointment for verification
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: [true, "Appointment is required"],
      unique: true, // One review per appointment
    },

    // Dentist reviewed
    dentist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Dentist is required"],
    },

    // Service reviewed
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"],
    },

    // Rating
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },

    // Review Title
    title: {
      type: String,
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
      default: "",
    },

    // Review Message
    comment: {
      type: String,
      required: [true, "Comment is required"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
      trim: true,
    },

    // Anonymous Review
    isAnonymous: {
      type: Boolean,
      default: false,
    },

    // Admin Approval
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Dentist/Admin Reply
    reply: {
      message: {
        type: String,
        default: null,
        maxlength: 1000,
      },

      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      repliedAt: {
        type: Date,
        default: null,
      },
    },

    // Helpful Count
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Soft Delete
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// ─────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────

reviewSchema.index({ patient: 1 });

reviewSchema.index({ dentist: 1 });

reviewSchema.index({ service: 1 });

reviewSchema.index({ rating: 1 });

reviewSchema.index({ status: 1 });

reviewSchema.index({ createdAt: -1 });

// ─────────────────────────────────────────────
// Virtual
// ─────────────────────────────────────────────

reviewSchema.virtual("isApproved").get(function () {
  return this.status === "approved";
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;