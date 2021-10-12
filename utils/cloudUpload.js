const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const multerStorage = multer.diskStorage({});

const multerFilter = (req, file, cb) => {
  const ext = file.mimetype.split("/")[1];
  if (ext !== "png" && ext !== "jpg" && ext !== "gif" && ext !== "jpeg") {
    return cb(
      new BadRequestError("Only images are allowed to be uploaded"),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, //3MB
  },
});

module.exports = { upload, cloudinary };
