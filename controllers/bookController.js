const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");
const Book = require("../models/Book");

const getBooks = async (req, res, next) => {
  const books = await Book.find({});
  res
    .status(StatusCodes.OK)
    .json({ status: "success", data: books, results: books.length });
};

const getBook = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Id is required");
  }
  const book = await Book.findOne({ _id: id });
  if (!book) {
    throw new NotFoundError("Book not found!");
  }
  res.status(StatusCodes.OK).json({ status: "success", data: book });
};

const addBook = async (req, res, next) => {
  const { title, author, publisher, ISBN, category } = req.body;
  const createdBy = req.user.userId;
  if (!title || !author || !publisher || !category) {
    throw new BadRequestError("Please submit required fields!");
  }
  const book = await Book.create({
    title,
    author,
    publisher,
    ISBN,
    category,
    createdBy,
  });
  res.status(StatusCodes.CREATED).json({ status: "success", data: book });
};

const updateBook = async (req, res, next) => {
  const { title, author, publisher, ISBN, category } = req.body;
  const createdBy = req.user.userId;
  if (!title || !author || !publisher || !category) {
    throw new BadRequestError("Please submit required fields!");
  }
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Id is required");
  }
  const book = await Book.findOneAndUpdate(
    { _id: id },
    { title, author, publisher, ISBN, category },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!book) {
    throw new NotFoundError("Book not found to update!");
  }
  res.status(StatusCodes.OK).json({ status: "success", data: book });
};

const removeBook = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Id is required");
  }
  const book = await Book.findOneAndDelete({ _id: id });
  if (!book) {
    throw new NotFoundError("Book not found to delete!");
  }
  res.status(StatusCodes.OK).json({ status: "success", data: book });
};

module.exports = {
  getBooks,
  getBook,
  addBook,
  updateBook,
  removeBook,
};
