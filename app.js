// package imports
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");

// local module imports
const connectDB = require("./db/connect");
const authRouter = require("./routes/authRouter");
const bookRouter = require("./routes/bookRouter");
const userRouter = require("./routes/userRouter");
const authMiddleware = require("./middlewares/auth");
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

// create server
const app = express();

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/dashboard.html", authMiddleware, (req, res, next) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});

app.use(express.static("./public"));

app.get("/currentUser", authMiddleware, (req, res, next) => {
  res.status(200).json({ status: "success", data: req.user });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/books", authMiddleware, bookRouter);
app.use("/api/v1/users", authMiddleware, userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
// envs
const port = process.env.PORT || 3000;
const URI = process.env.DB_URI; //|| "mongodb://localhost:27017/BookStore"

// start server
const start = async () => {
  try {
    await connectDB(URI);
    console.log("Connected");
    await app.listen(port, () => {
      console.log(`Listening at port ${port}`);
    });
  } catch (err) {
    console.log(err.message);
  }
};

start();
