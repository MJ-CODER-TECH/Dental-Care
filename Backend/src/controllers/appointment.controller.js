const { StatusCodes } = require("http-status-codes");
const Appointment = require("../models/appointment.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const { ApiError, ApiResponse, asyncHandler } = require("../utils/apiHelpers");

// ─── Helper: Build filter from query params ───────────────
const buildFilter = (query, userRole, userId) => {
  const filter = {};

  // Patients only see their own appointments
  if (userRole === "patient") filter.patient = userId;
  // Dentists see their own schedule by default
  if (userRole === "dentist") filter.dentist = userId;

  // Admin/receptionist can filter by specific patient or dentist
  if (query.patient) filter.patient = query.patient;
  if (query.dentist) filter.dentist = query.dentist;
  if (query.status) filter.status = query.status;
  if (query.service) filter.service = query.service;

  if (query.from || query.to) {
    filter.appointmentDate = {};
    if (query.from) filter.appointmentDate.$gte = new Date(query.from);
    if (query.to) filter.appointmentDate.$lte = new Date(query.to);
  }

  return filter;
};

// ─── GET /appointments ────────────────────────────────────
const getAllAppointments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || "-appointmentDate";

  const filter = buildFilter(req.query, req.user.role, req.user._id);

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate("patient", "name email phone")
      .populate("dentist", "name email")
      .populate("service", "name category duration price")
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Appointment.countDocuments(filter),
  ]);

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      appointments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
      },
    }, "Appointments fetched")
  );
});

// ─── GET /appointments/:id ────────────────────────────────
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("patient", "name email phone dateOfBirth gender medicalHistory")
    .populate("dentist", "name email phone")
    .populate("service", "name category duration price requiresAnesthesia")
    .populate("notes.addedBy", "name role");

  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Appointment not found");
  }

  // Patients can only see their own
  if (
    req.user.role === "patient" &&
    appointment.patient._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Access denied");
  }

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { appointment }, "Appointment fetched")
  );
});

// ─── POST /appointments ───────────────────────────────────
const createAppointment = asyncHandler(async (req, res) => {
  const { dentist, service, appointmentDate, timeSlot, symptoms } = req.body;

  // Validate service exists and is active
  const serviceDoc = await Service.findOne({ _id: service, isActive: true });
  if (!serviceDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found or inactive");
  }

  // Validate dentist exists with correct role
  const dentistDoc = await User.findOne({ _id: dentist, role: "dentist", isActive: true });
  if (!dentistDoc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Dentist not found or unavailable");
  }

  // Check slot availability (no double booking)
  const slotConflict = await Appointment.findOne({
    dentist,
    appointmentDate: new Date(appointmentDate),
    "timeSlot.start": timeSlot.start,
    status: { $nin: ["cancelled", "no_show"] },
  });
  if (slotConflict) {
    throw new ApiError(StatusCodes.CONFLICT, "This time slot is already booked");
  }

  // Determine who the patient is
  const patientId =
    ["admin", "receptionist"].includes(req.user.role)
      ? req.body.patient || req.user._id
      : req.user._id;

  const appointment = await Appointment.create({
    patient: patientId,
    dentist,
    service,
    appointmentDate: new Date(appointmentDate),
    timeSlot,
    symptoms,
    bookedBy: req.user._id,
    amount: { charged: serviceDoc.price.base },
    statusHistory: [{ status: "pending", changedBy: req.user._id }],
  });

  const populated = await appointment.populate([
    { path: "patient", select: "name email phone" },
    { path: "dentist", select: "name email" },
    { path: "service", select: "name category duration price" },
  ]);

  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, { appointment: populated }, "Appointment booked successfully")
  );
});

// ─── PATCH /appointments/:id/status ──────────────────────
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, reason, diagnosis, prescription } = req.body;

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Appointment not found");
  }

  // Patients can only cancel their own
  if (req.user.role === "patient") {
    if (appointment.patient.toString() !== req.user._id.toString()) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Access denied");
    }
    if (status !== "cancelled") {
      throw new ApiError(StatusCodes.FORBIDDEN, "Patients can only cancel appointments");
    }
    // Enforce 2-hour cancellation window
    const hoursUntilAppt = (appointment.appointmentDate - Date.now()) / 36e5;
    if (hoursUntilAppt < 2) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Cannot cancel within 2 hours of appointment");
    }
  }

  appointment.status = status;
  appointment.statusHistory.push({
    status,
    changedBy: req.user._id,
    changedAt: new Date(),
    reason,
  });

  if (reason) appointment.cancellationReason = reason;
  if (diagnosis) appointment.diagnosis = diagnosis;
  if (prescription) appointment.prescription = prescription;

  await appointment.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { appointment }, `Appointment ${status}`)
  );
});

// ─── POST /appointments/:id/notes ─────────────────────────
const addNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Note text is required");
  }

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { $push: { notes: { text: text.trim(), addedBy: req.user._id } } },
    { new: true }
  ).populate("notes.addedBy", "name role");

  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Appointment not found");
  }

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { notes: appointment.notes }, "Note added")
  );
});

// ─── DELETE /appointments/:id ─────────────────────────────
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Appointment not found");
  }

  // Soft-delete: mark as cancelled instead of removing
  appointment.status = "cancelled";
  appointment.cancellationReason = "Deleted by admin";
  appointment.statusHistory.push({
    status: "cancelled",
    changedBy: req.user._id,
    reason: "Deleted by admin",
  });
  await appointment.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {}, "Appointment cancelled and archived")
  );
});

// ─── GET /appointments/availability ──────────────────────
const checkAvailability = asyncHandler(async (req, res) => {
  const { dentistId, date } = req.query;
  if (!dentistId || !date) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "dentistId and date are required");
  }

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const bookedSlots = await Appointment.find({
    dentist: dentistId,
    appointmentDate: { $gte: dayStart, $lte: dayEnd },
    status: { $nin: ["cancelled", "no_show"] },
  }).select("timeSlot -_id");

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { bookedSlots }, "Availability fetched")
  );
});

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  addNote,
  deleteAppointment,
  checkAvailability,
};