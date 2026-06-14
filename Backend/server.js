const path = require("path");
const fs = require("fs");

// dotenv v17 syntax
const { configDotenv } = require("dotenv");
configDotenv({ path: path.resolve(__dirname, ".env") });

console.log("STEP 1: env loaded");
console.log("MONGO_URI:", process.env.MONGO_URI);

// ─── Safe require for app (to catch silent crashes) ───────
let app;
try {
  app = require("./src/app");
  console.log("STEP 2: app loaded");
} catch (err) {
  fs.writeFileSync(
    path.resolve(__dirname, "crash.log"),
    (err && err.stack) ? err.stack : String(err)
  );
  console.error("❌ APP REQUIRE FAILED - check crash.log for details");
  process.exit(1);
}

let connectDB;
try {
  connectDB = require("./src/config/db");
  console.log("STEP 3: db module loaded");
} catch (err) {
  fs.writeFileSync(
    path.resolve(__dirname, "crash.log"),
    (err && err.stack) ? err.stack : String(err)
  );
  console.error("❌ DB MODULE REQUIRE FAILED - check crash.log for details");
  process.exit(1);
}

let logger;
try {
  logger = require("./src/utils/logger");
  console.log("STEP 4: logger loaded");
} catch (err) {
  fs.writeFileSync(
    path.resolve(__dirname, "crash.log"),
    (err && err.stack) ? err.stack : String(err)
  );
  console.error("❌ LOGGER REQUIRE FAILED - check crash.log for details");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log("STEP 5: connecting to DB...");
  await connectDB();
  console.log("STEP 6: DB connected");

  const server = app.listen(PORT, () => {
    console.log("STEP 7: server is listening");
    logger.info(`🦷 Dental API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });

  const shutdown = async (signal) => {
    logger.warn(`⚠️  ${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      logger.info("HTTP server closed");
      const mongoose = require("mongoose");
      await mongoose.connection.close();
      logger.info("MongoDB connection closed");
      process.exit(0);
    });
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    console.error("UNHANDLED REJECTION:", reason);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
    process.exit(1);
  });
};

startServer().catch((err) => {
  console.error("❌ startServer() FAILED:", err);
  fs.writeFileSync(
    path.resolve(__dirname, "crash.log"),
    (err && err.stack) ? err.stack : String(err)
  );
  process.exit(1);
});