const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = async (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong",
  };

  if (err.name === "ValidationError") {
    if (Object.keys(err.errors).length > 1) {
      customError.message = `Please provide validated fields`;
    } else {
      customError.message = Object.values(err.errors)[0].message;
    }
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.message = "User already exists";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (
    customError.statusCode === StatusCodes.UNAUTHORIZED &&
    customError.message == "No access!"
  ) {
    return res.redirect("/index.html");
  }

  res
    .status(customError.statusCode)
    .json({ status: "fail", message: customError.message });
};

module.exports = errorHandlerMiddleware;
