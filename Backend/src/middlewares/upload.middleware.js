const multer = require("multer");

// ──────────────────────────────────────────────────────────
// Memory Storage
// Image pehle RAM me jayegi, fir direct Cloudinary upload hogi
// ──────────────────────────────────────────────────────────
const storage = multer.memoryStorage();

// ──────────────────────────────────────────────────────────
// Allowed Image Types
// ──────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP and AVIF images are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

// ──────────────────────────────────────────────────────────
// Multer Upload Instance
// ──────────────────────────────────────────────────────────
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;