const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/users");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

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

module.exports = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, //3MB
  },
});
