const { StatusCodes } = require("http-status-codes");
const Service = require("../models/service.model");
const { ApiError, ApiResponse, asyncHandler } = require("../utils/apiHelpers");

// ─── GET /services ────────────────────────────────────────
const getAllServices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.$text = { $search: req.query.search };
  // Public endpoint shows only active services; admin can see all
  if (req.user?.role !== "admin") filter.isActive = true;

  const sortBy = req.query.sortBy || "name";

  const [services, total] = await Promise.all([
    Service.find(filter)
      .select("-createdBy")
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Service.countDocuments(filter),
  ]);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      services,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, "Services fetched")
  );
});

// ─── GET /services/:id ────────────────────────────────────
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate("createdBy", "name");
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
  }

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { service }, "Service fetched")
  );
});

// ─── POST /services ───────────────────────────────────────
const createService = asyncHandler(async (req, res) => {
  const { name, category, description, shortDescription, duration, price, requiresAnesthesia, followUpRequired, followUpDays, availableFor } = req.body;

  const service = await Service.create({
    name,
    category,
    description,
    shortDescription,
    duration,
    price,
    requiresAnesthesia,
    followUpRequired,
    followUpDays,
    availableFor,
    createdBy: req.user._id,
  });

  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, { service }, "Service created successfully")
  );
});

// ─── PUT /services/:id ────────────────────────────────────
const updateService = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    "name", "category", "description", "shortDescription",
    "duration", "price", "requiresAnesthesia", "followUpRequired",
    "followUpDays", "availableFor", "isActive", "image",
  ];

  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const service = await Service.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
  }

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { service }, "Service updated")
  );
});

// ─── DELETE /services/:id ─────────────────────────────────
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found");
  }

  // Soft delete - keeps historical appointment data intact
  service.isActive = false;
  await service.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {}, "Service deactivated successfully")
  );
});

// ─── GET /services/categories ─────────────────────────────
const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Service.distinct("category", { isActive: true });
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { categories }, "Categories fetched")
  );
});

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getCategories,
};