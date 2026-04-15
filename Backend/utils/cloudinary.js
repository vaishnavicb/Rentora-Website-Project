const cloudinary = require("cloudinary").v2;

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  !process.env.CLOUDINARY_CLOUD_NAME.includes("your_") &&
  process.env.CLOUDINARY_API_KEY &&
  !process.env.CLOUDINARY_API_KEY.includes("your_") &&
  process.env.CLOUDINARY_API_SECRET &&
  !process.env.CLOUDINARY_API_SECRET.includes("your_");

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
};
