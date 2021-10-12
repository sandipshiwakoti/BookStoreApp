const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");
const User = require("../models/User");
const { cloudinary } = require("../utils/cloudUpload");

const getUsers = async (req, res, next) => {
  const users = await User.find({});
  res
    .status(StatusCodes.OK)
    .json({ status: "success", data: users, results: users.length });
};

const getUser = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Id is required");
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFoundError("User not found!");
  }
  res.status(StatusCodes.OK).json({ status: "success", data: user });
};

const addUser = async (req, res, next) => {
  const result = await cloudinary.uploader.upload(req.file.path);
  const cloudinary_id = result.public_id;
  const photo = result.secure_url;
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new BadRequestError("Please submit required fields!");
  }
  const user = await User.create({
    username,
    email,
    password,
    photo,
    cloudinary_id,
  });
  res.status(StatusCodes.CREATED).json({ status: "success", data: user });
};

const updateUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new BadRequestError("Please submit required fields!");
  }
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Id is required");
  }
  let user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFoundError("User not found!");
  }
  let result;
  if (req.file) {
    const destroyResult = await cloudinary.uploader.destroy(user.cloudinary_id);
    if (destroyResult.result == "not found") {
      throw new NotFoundError("Cloud error!");
    }
    result = await cloudinary.uploader.upload(req.file.path);
  }
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);
  user = await User.findOneAndUpdate(
    { _id: id },
    {
      username,
      email,
      password: encryptedPassword,
      photo: result ? result.secure_url : user.photo,
      cloudinary_id: result ? result.public_id : user.cloudinary_id,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!user) {
    throw new NotFoundError("Could not update!");
  }
  res.status(StatusCodes.OK).json({ status: "success", data: user });
};

const removeUser = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Id is required");
  }
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    throw new NotFoundError("User not found to delete!");
  }
  await cloudinary.uploader.destroy(user.cloudinary_id);
  res.status(StatusCodes.OK).json({ status: "success", data: user });
};

const resetPassword = async (req, res, next) => {
  const { id } = req.params;
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    throw new BadRequestError("Please provide required fields");
  }
  const user = await User.findOne({ _id: id, email });
  if (!user) {
    throw new BadRequestError("User doesn't exist");
  }
  const isCorrect = await user.comparePassword(oldPassword);
  if (!isCorrect) {
    throw new UnauthorizedError("Incorrect old password!");
  }
  const isChanged = await user.changePassword(newPassword);
  if (!isChanged) {
    return res
      .status(StatusCodes.OK)
      .json({ status: "fail", message: "Couldn't change password" });
  }
  res.status(StatusCodes.OK).json({ status: "success", data: user });
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser,
  resetPassword,
};
