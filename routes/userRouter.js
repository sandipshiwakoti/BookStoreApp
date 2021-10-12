const express = require("express");
const multer = require("multer");
const { BadRequestError } = require("../errors");
const {
  getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser,
  resetPassword,
} = require("../controllers/userController");
const { upload, cloudinary } = require("../utils/cloudUpload");

const router = express.Router();

router.route("/").get(getUsers).post(upload.single("photo"), addUser);
router
  .route("/:id")
  .get(getUser)
  .patch(upload.single("photo"), updateUser)
  .delete(removeUser);
router.route("/:id/reset").post(resetPassword);
module.exports = router;
