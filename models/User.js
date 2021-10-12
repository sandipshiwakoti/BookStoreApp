const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide username"],
    minlength: [5, "Username should be at least 5 characters"],
    maxlength: [20, "Username should not be more than 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    maxlength: 100,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: [8, "Password should be at least 8 characters"],
    maxlength: [100, "Password should not be more than 100 characters"],
  },
  photo: {
    type: String,
  },
  cloudinary_id: {
    type: String,
    default: "default",
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(this.password, salt);
  this.password = encryptedPassword;
});

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

UserSchema.methods.changePassword = async function (newPassword) {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);
  this.password = encryptedPassword;
  return true;
};

UserSchema.methods.createJWT = function () {
  const { _id: userId, username } = this;
  return jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

module.exports = mongoose.model("User", UserSchema);
