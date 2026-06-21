const mongoose = require("mongoose");

// ─── Note Sub-schema ──────────────────────────────────────
const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, maxlength: 500 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// ─── Main Appointment Schema ──────────────────────────────
const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
    },

    dentist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Dentist is required"],
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"],
    },

    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
      validate: {
        validator: function (date) {
          // Must be a future date
          return date > new Date();
        },
        message: "Appointment date must be in the future",
      },
    },

    timeSlot: {
      start: {
        type: String, // "HH:MM" format, e.g. "09:30"
        required: [true, "Start time is required"],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"],
      },
      end: {
        type: String,
        required: [true, "End time is required"],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"],
      },
    },

    status: {
      type: String,
      enum: {
        values: [
          "pending",      // booked, awaiting confirmation
          "confirmed",    // confirmed by clinic
          "in_progress",  // patient is in chair
          "completed",    // treatment done
          "cancelled",    // cancelled by patient/clinic
          "no_show",      // patient didn't show up
          "rescheduled",  // moved to new slot
        ],
        message: "Invalid appointment status",
      },
      default: "pending",
    },

    statusHistory: [
      {
        status: String,
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        changedAt: { type: Date, default: Date.now },
        reason: String,
      },
    ],

    cancellationReason: {
      type: String,
      maxlength: 300,
    },

    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    symptoms: {
      type: String,
      maxlength: [500, "Symptoms description too long"],
    },

    diagnosis: {
      type: String,
      maxlength: [500, "Diagnosis too long"],
    },

    prescription: {
      type: String,
      maxlength: [1000, "Prescription too long"],
    },

    toothChart: {
      // Array of affected tooth numbers (FDI notation: 11-48)
      type: [Number],
      default: [],
    },

    amount: {
      charged: {
        type: Number,
        min: 0,
        default: 0,
      },
      paid: {
        type: Number,
        min: 0,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "refunded"],
      default: "pending",
    },

    notes: [noteSchema],

    reminderSent: {
      type: Boolean,
      default: false,
    },

    followUp: {
      required: { type: Boolean, default: false },
      date: { type: Date, default: null },
      notes: { type: String, default: null },
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ dentist: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });
// Compound: prevents double-booking same dentist at same slot
appointmentSchema.index(
  { dentist: 1, appointmentDate: 1, "timeSlot.start": 1 },
  { unique: true, partialFilterExpression: { status: { $nin: ["cancelled", "no_show"] } } }
);

// ─── Virtuals ─────────────────────────────────────────────
appointmentSchema.virtual("isPast").get(function () {
  return this.appointmentDate < new Date();
});

appointmentSchema.virtual("balanceDue").get(function () {
  return (this.amount.charged || 0) - (this.amount.paid || 0);
});

// ─── Pre-save: Track status changes ───────────────────────
appointmentSchema.pre("save", function () {
  if (this.isModified("status") && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
    });
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;