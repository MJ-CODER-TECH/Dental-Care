const { StatusCodes } = require("http-status-codes");

const Review = require("../models/review.model");
const Appointment = require("../models/appointment.model");

const {
  ApiError,
  ApiResponse,
  asyncHandler,
} = require("../utils/apiHelpers");

// ─────────────────────────────────────────────
// CREATE REVIEW
// POST /reviews
// Patient
// ─────────────────────────────────────────────

const createReview = asyncHandler(async (req, res) => {
  const {
    appointment,
    rating,
    title,
    comment,
  } = req.body;

  // Find Appointment
  const appointmentDoc = await Appointment.findById(appointment);

  if (!appointmentDoc) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Appointment not found"
    );
  }

  // Appointment belongs to logged in patient
  if (
    appointmentDoc.patient.toString() !==
    req.user._id.toString()
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You can review only your own appointments"
    );
  }

  // Appointment must be completed
  if (appointmentDoc.status !== "completed") {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Review can only be submitted after appointment completion"
    );
  }

  // Already reviewed?
  const existingReview = await Review.findOne({
    appointment,
    patient: req.user._id,
    isActive: true,
  });

  if (existingReview) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Review already submitted for this appointment"
    );
  }

  // Create Review
  const review = await Review.create({
    appointment,

    patient: req.user._id,

    dentist: appointmentDoc.dentist,

    service: appointmentDoc.service,

    rating,

    title,

    comment,
  });

  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(
      StatusCodes.CREATED,
      { review },
      "Review submitted successfully"
    )
  );
});
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// GET ALL REVIEWS
// GET /reviews
// Public
// ─────────────────────────────────────────────

const getAllReviews = asyncHandler(async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = {
    isApproved: true,
    isActive: true,
  };

  // Rating Filter
  if (req.query.rating) {
    filter.rating = Number(req.query.rating);
  }

  // Dentist Filter
  if (req.query.dentist) {
    filter.dentist = req.query.dentist;
  }

  // Service Filter
  if (req.query.service) {
    filter.service = req.query.service;
  }

  // Search
  if (req.query.search) {
    filter.$or = [
      {
        title: {
          $regex: req.query.search,
          $options: "i",
        },
      },
      {
        comment: {
          $regex: req.query.search,
          $options: "i",
        },
      },
    ];
  }

  // Sorting
  let sort = { createdAt: -1 };

  switch (req.query.sort) {
    case "oldest":
      sort = { createdAt: 1 };
      break;

    case "highest":
      sort = { rating: -1 };
      break;

    case "lowest":
      sort = { rating: 1 };
      break;

    default:
      sort = { createdAt: -1 };
  }

  const [reviews, total] = await Promise.all([

    Review.find(filter)

      .populate("patient", "name profileImage")

      .populate("dentist", "name")

      .populate("service", "name")

      .sort(sort)

      .skip(skip)

      .limit(limit)

      .lean(),

    Review.countDocuments(filter),

  ]);

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {

        reviews,

        pagination: {

          page,

          limit,

          total,

          totalPages: Math.ceil(total / limit),

          hasNextPage: page < Math.ceil(total / limit),

          hasPrevPage: page > 1,

        },

      },

      "Reviews fetched successfully"

    )

  );

});

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// GET REVIEW BY ID
// GET /reviews/:id
// Public
// ─────────────────────────────────────────────

const getReviewById = asyncHandler(async (req, res) => {

  const review = await Review.findOne({
    _id: req.params.id,
    isApproved: true,
    isActive: true,
  })

    .populate(
      "patient",
      "name profileImage"
    )

    .populate(
      "dentist",
      "name"
    )

    .populate(
      "service",
      "name category"
    )

    .populate(
      "appointment",
      "appointmentDate"
    );

  if (!review) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Review not found"
    );
  }

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      { review },

      "Review fetched successfully"

    )

  );

});

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// GET DENTIST REVIEWS
// GET /reviews/dentist/:dentistId
// Public
// ─────────────────────────────────────────────

const getDentistReviews = asyncHandler(async (req, res) => {

  const dentistId = req.params.dentistId;

  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = {
    dentist: dentistId,
    isApproved: true,
    isActive: true,
  };

  // Rating Filter
  if (req.query.rating) {
    filter.rating = Number(req.query.rating);
  }

  // Sort
  let sort = { createdAt: -1 };

  switch (req.query.sort) {

    case "oldest":
      sort = { createdAt: 1 };
      break;

    case "highest":
      sort = { rating: -1 };
      break;

    case "lowest":
      sort = { rating: 1 };
      break;

    default:
      sort = { createdAt: -1 };

  }

  const [reviews, total] = await Promise.all([

    Review.find(filter)

      .populate("patient", "name profileImage")

      .populate("service", "name")

      .sort(sort)

      .skip(skip)

      .limit(limit)

      .lean(),

    Review.countDocuments(filter),

  ]);

  // Rating Statistics
  const stats = await Review.aggregate([

    {
      $match: {
        dentist: review.constructor.Types.ObjectId
          ? undefined
          : undefined
      }
    }

  ]);

  const ratingStats = await Review.aggregate([

    {
      $match: {
        dentist: require("mongoose").Types.ObjectId.createFromHexString(dentistId),
        isApproved: true,
        isActive: true,
      },
    },

    {
      $group: {

        _id: "$rating",

        count: {
          $sum: 1,
        },

        averageRating: {
          $avg: "$rating",
        },

      },
    },

  ]);

  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  ratingStats.forEach((item) => {
    distribution[item._id] = item.count;
  });

  const averageRating =
    ratingStats.length > 0
      ? (
          ratingStats.reduce(
            (sum, item) =>
              sum + item._id * item.count,
            0
          ) / total
        ).toFixed(1)
      : 0;

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {

        reviews,

        statistics: {

          averageRating,

          totalReviews: total,

          ratingDistribution: distribution,

        },

        pagination: {

          page,

          limit,

          total,

          totalPages: Math.ceil(total / limit),

          hasNextPage:
            page < Math.ceil(total / limit),

          hasPrevPage:
            page > 1,

        },

      },

      "Dentist reviews fetched successfully"

    )

  );

});

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// GET SERVICE REVIEWS
// GET /reviews/service/:serviceId
// Public
// ─────────────────────────────────────────────

const getServiceReviews = asyncHandler(async (req, res) => {

  const serviceId = req.params.serviceId;

  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = {
    service: serviceId,
    isApproved: true,
    isActive: true,
  };

  // Rating Filter
  if (req.query.rating) {
    filter.rating = Number(req.query.rating);
  }

  // Sort
  let sort = { createdAt: -1 };

  switch (req.query.sort) {

    case "oldest":
      sort = { createdAt: 1 };
      break;

    case "highest":
      sort = { rating: -1 };
      break;

    case "lowest":
      sort = { rating: 1 };
      break;

    default:
      sort = { createdAt: -1 };

  }

  const [reviews, total] = await Promise.all([

    Review.find(filter)

      .populate("patient", "name profileImage")

      .populate("dentist", "name")

      .sort(sort)

      .skip(skip)

      .limit(limit)

      .lean(),

    Review.countDocuments(filter),

  ]);

  // Rating Statistics
  const ratingStats = await Review.aggregate([

    {
      $match: {
        service: new mongoose.Types.ObjectId(serviceId),
        isApproved: true,
        isActive: true,
      },
    },

    {
      $group: {
        _id: "$rating",
        count: {
          $sum: 1,
        },
      },
    },

  ]);

  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  ratingStats.forEach((item) => {
    distribution[item._id] = item.count;
  });

  const averageRating =
    total > 0
      ? (
          ratingStats.reduce(
            (sum, item) => sum + (item._id * item.count),
            0
          ) / total
        ).toFixed(1)
      : 0;

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {

        reviews,

        statistics: {

          averageRating,

          totalReviews: total,

          ratingDistribution: distribution,

        },

        pagination: {

          page,

          limit,

          total,

          totalPages: Math.ceil(total / limit),

          hasNextPage: page < Math.ceil(total / limit),

          hasPrevPage: page > 1,

        },

      },

      "Service reviews fetched successfully"

    )

  );

});

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// UPDATE REVIEW
// PUT /reviews/:id
// Patient
// ─────────────────────────────────────────────

const updateReview = asyncHandler(async (req, res) => {

  const review = await Review.findById(req.params.id);

  if (!review || !review.isActive) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Review not found"
    );
  }

  // Only owner can update
  if (
    review.patient.toString() !==
    req.user._id.toString()
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You are not allowed to update this review"
    );
  }

  // Allowed Fields
  const allowedUpdates = [
    "rating",
    "title",
    "comment",
  ];

  allowedUpdates.forEach((field) => {

    if (req.body[field] !== undefined) {
      review[field] = req.body[field];
    }

  });

  // Re-approval required after update
  review.isApproved = false;

  await review.save();

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {
        review,
      },

      "Review updated successfully. Waiting for admin approval."

    )

  );

});

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// DELETE REVIEW
// DELETE /reviews/:id
// Patient/Admin
// ─────────────────────────────────────────────

const deleteReview = asyncHandler(async (req, res) => {

  const review = await Review.findById(req.params.id);

  if (!review || !review.isActive) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Review not found"
    );
  }

  // Patient can delete only own review
  if (
    req.user.role === "patient" &&
    review.patient.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You are not allowed to delete this review"
    );
  }

  review.isActive = false;

  await review.save();

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      null,

      "Review deleted successfully"

    )

  );

});

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// APPROVE REVIEW
// PATCH /reviews/:id/approve
// Admin
// ─────────────────────────────────────────────

const approveReview = asyncHandler(async (req, res) => {

  const review = await Review.findById(req.params.id);

  if (!review || !review.isActive) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Review not found"
    );
  }

  review.isApproved = true;

  await review.save();

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {
        review,
      },

      "Review approved successfully"

    )

  );

});

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// REJECT REVIEW
// PATCH /reviews/:id/reject
// Admin
// ─────────────────────────────────────────────

const rejectReview = asyncHandler(async (req, res) => {

  const review = await Review.findById(req.params.id);

  if (!review || !review.isActive) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Review not found"
    );
  }

  review.isApproved = false;

  await review.save();

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {
        review,
      },

      "Review rejected successfully"

    )

  );

});

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// DENTIST REPLY
// PATCH /reviews/:id/reply
// Dentist
// ─────────────────────────────────────────────

const replyReview = asyncHandler(async (req, res) => {

  const { message } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review || !review.isActive) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Review not found"
    );
  }

  // Dentist can reply only to own reviews
  if (
    review.dentist.toString() !==
    req.user._id.toString()
  ) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "You cannot reply to this review"
    );
  }

  review.reply = {

    message,

    repliedBy: req.user._id,

    repliedAt: new Date(),

  };

  await review.save();

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {
        review,
      },

      "Reply added successfully"

    )

  );

});

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// RATING STATISTICS
// GET /reviews/stats/:dentistId
// Public
// ─────────────────────────────────────────────

const getRatingStats = asyncHandler(async (req, res) => {

  const dentistId = new mongoose.Types.ObjectId(
    req.params.dentistId
  );

  const stats = await Review.aggregate([

    {
      $match: {
        dentist: dentistId,
        isApproved: true,
        isActive: true,
      },
    },

    {
      $group: {
        _id: "$rating",
        count: {
          $sum: 1,
        },
      },
    },

  ]);

  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let total = 0;
  let sum = 0;

  stats.forEach((item) => {

    distribution[item._id] = item.count;

    total += item.count;

    sum += item._id * item.count;

  });

  const averageRating =
    total > 0
      ? Number((sum / total).toFixed(1))
      : 0;

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {

        averageRating,

        totalReviews: total,

        ratingDistribution: distribution,

      },

      "Rating statistics fetched successfully"

    )

  );

});

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  getDentistReviews,
  getServiceReviews,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  replyReview,
  getRatingStats,
};