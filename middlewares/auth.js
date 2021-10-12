const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies.access_token) {
    token = req.cookies.access_token;
  } else {
    throw new UnauthorizedError("No access!");
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const { userId, username } = decoded;
    req.user = { userId, username };
    next();
  } catch (err) {
    throw new UnauthorizedError("No access!");
  }
};

module.exports = authMiddleware;
