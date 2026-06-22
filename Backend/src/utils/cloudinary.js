const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// ─────────────────────────────────────────────────────────
// Upload Image to Cloudinary
// folder example:
// blogs
// services
// doctors
// patients
// gallery
// ─────────────────────────────────────────────────────────

const uploadImage = (file, folder = "dental-care") => {
  return new Promise((resolve, reject) => {

    if (!file) {
      return reject(new Error("No file provided"));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `dental-care/${folder}`,

        resource_type: "image",

        overwrite: true,

        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },

      (error, result) => {

        if (error) {
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);

  });
};

// ─────────────────────────────────────────────────────────
// Delete Image
// ─────────────────────────────────────────────────────────

const deleteImage = async (publicId) => {

  if (!publicId) return;

  return cloudinary.uploader.destroy(publicId);

};

// ─────────────────────────────────────────────────────────
// Replace Image
// Delete old image then upload new one
// ─────────────────────────────────────────────────────────

const replaceImage = async (
  oldPublicId,
  file,
  folder
) => {

  if (oldPublicId) {
    await deleteImage(oldPublicId);
  }

  return uploadImage(file, folder);

};

module.exports = {
  uploadImage,
  deleteImage,
  replaceImage,
};