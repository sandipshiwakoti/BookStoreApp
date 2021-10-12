const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");
const User = require("../models/User");

const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).send({ status: "success", data: user });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide both email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError(`Email doesn't exist`);
  }
  const isCorrect = await user.comparePassword(password);
  if (!isCorrect) {
    throw new UnauthorizedError("Incorrect password!");
  }
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .cookie("access_token", token, {
      // expires: new Date(new Date().getTime() + 864000),
      httpOnly: true,
      secure: false, //in prod, secure: true
    })
    .send({ status: "success", data: user, token });
};

const logout = async (req, res, next) => {
  return res
    .cookie("access_token", "", {
      httpOnly: true,
      secure: false, //in prod, secure: true
    })
    .redirect("/index.html");
  // if (!req.cookies.access_token) {
  //   throw new UnauthorizedError("You are not logged in");
  // }
};

module.exports = { register, login, logout };
