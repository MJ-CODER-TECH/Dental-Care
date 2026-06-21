const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const logger = require("./utils/logger");
const { errorHandler, notFound } = require("./middlewares/error.middleware");

// ─── Routes ───────────────────────────────────────────────
const authRoutes        = require("./routes/auth.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const serviceRoutes     = require("./routes/service.routes");

const app = express();

// ─── Security Headers ─────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Rate Limiting ────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 10, // stricter for auth endpoints
//   message: { success: false, message: "Too many auth attempts. Try again in 15 minutes." },
// });

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(globalLimiter);

// ─── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));        // prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// ─── Sanitization ─────────────────────────────────────────
// app.use(mongoSanitize()); // prevent NoSQL injection

// ─── Compression ──────────────────────────────────────────
app.use(compression());

// ─── HTTP Logging ─────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.http(message.trim()) },
    })
  );
}

// ─── Health Check ─────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Dental API is running",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────
const API_VERSION = "/api/v1";

app.use(`${API_VERSION}/auth`,         authLimiter, authRoutes);
app.use(`${API_VERSION}/appointments`, appointmentRoutes);
app.use(`${API_VERSION}/services`,     serviceRoutes);

// ─── 404 + Global Error Handler ───────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;