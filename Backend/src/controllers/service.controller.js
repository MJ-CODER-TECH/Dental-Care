const { StatusCodes } = require("http-status-codes");
const Service = require("../models/service.model");

const {
  ApiError,
  ApiResponse,
  asyncHandler,
} = require("../utils/apiHelpers");

const {
  uploadImage,
  replaceImage,
  deleteImage,
} = require("../utils/cloudinary");


// ───────────────────────────────────────────────
// GET ALL SERVICES
// ───────────────────────────────────────────────

const getAllServices = asyncHandler(async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.search) {
    filter.$text = {
      $search: req.query.search,
    };
  }

  if (req.user?.role !== "admin") {
    filter.isActive = true;
  }

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

    new ApiResponse(

      StatusCodes.OK,

      {
        services,

        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },

      },

      "Services fetched successfully"

    )

  );

});


// ───────────────────────────────────────────────
// GET SERVICE BY ID
// ───────────────────────────────────────────────

const getServiceById = asyncHandler(async (req, res) => {

  const service = await Service.findById(req.params.id)
    .populate("createdBy", "name email");

  if (!service) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Service not found"
    );
  }

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {
        service,
      },

      "Service fetched successfully"

    )

  );

});


// ───────────────────────────────────────────────
// CREATE SERVICE
// ───────────────────────────────────────────────

const createService = asyncHandler(async (req, res) => {

  const existing = await Service.findOne({
    name: req.body.name.trim(),
  });

  if (existing) {

    throw new ApiError(
      StatusCodes.CONFLICT,
      "Service already exists"
    );

  }

  let image = {
    url: null,
    publicId: null,
  };

  if (req.file) {

    const uploaded = await uploadImage(
      req.file,
      "services"
    );

    image = {
      url: uploaded.url,
      publicId: uploaded.publicId,
    };

  }

  const service = await Service.create({

    name: req.body.name,

    category: req.body.category,

    description: req.body.description,

    shortDescription: req.body.shortDescription,

    duration: req.body.duration,

    price: req.body.price,

    requiresAnesthesia: req.body.requiresAnesthesia,

    followUpRequired: req.body.followUpRequired,

    followUpDays: req.body.followUpDays,

    availableFor: req.body.availableFor,

    image,

    createdBy: req.user._id,

  });

  return res.status(StatusCodes.CREATED).json(

    new ApiResponse(

      StatusCodes.CREATED,

      {
        service,
      },

      "Service created successfully"

    )

  );

});

// ─── PUT /services/:id ────────────────────────────────────
// ───────────────────────────────────────────────
// UPDATE SERVICE
// ───────────────────────────────────────────────

const updateService = asyncHandler(async (req, res) => {

  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Service not found"
    );
  }

  // Replace Image
  if (req.file) {

    const uploaded = await replaceImage(
      service.image?.publicId,
      req.file,
      "services"
    );

    service.image = {
      url: uploaded.url,
      publicId: uploaded.publicId,
    };

  }

  const allowedUpdates = [

    "name",

    "category",

    "description",

    "shortDescription",

    "duration",

    "price",

    "requiresAnesthesia",

    "followUpRequired",

    "followUpDays",

    "availableFor",

    "isActive",

  ];

  allowedUpdates.forEach((field) => {

    if (req.body[field] !== undefined) {
      service[field] = req.body[field];
    }

  });

  await service.save();

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {
        service,
      },

      "Service updated successfully"

    )

  );

});

// ─── DELETE /services/:id ─────────────────────────────────
// ───────────────────────────────────────────────
// DELETE SERVICE
// ───────────────────────────────────────────────

const deleteService = asyncHandler(async (req, res) => {

  const service = await Service.findById(req.params.id);

  if (!service) {

    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Service not found"
    );

  }

  // Delete image from Cloudinary
  if (service.image?.publicId) {

    await deleteImage(service.image.publicId);

  }

  // Soft Delete
  service.isActive = false;

  await service.save();

  return res.status(StatusCodes.OK).json(

    new ApiResponse(

      StatusCodes.OK,

      {},

      "Service deleted successfully"

    )

  );

});

// ─── GET /services/categories ─────────────────────────────
// ───────────────────────────────────────────────
// GET SERVICE CATEGORIES
// ───────────────────────────────────────────────

const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Service.distinct("category", { isActive: true });
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { categories }, "Categories fetched")
  );
});

// ─── DELETE /services/:id ─────────────────────────────────
// ───────────────────────────────────────────────
// DELETE SERVICE
// ───────────────────────────────────────────────



module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getCategories
};