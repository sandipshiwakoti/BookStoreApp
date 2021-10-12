const express = require("express");
const {
  getBooks,
  getBook,
  addBook,
  updateBook,
  removeBook,
} = require("../controllers/bookController");

const router = express.Router();

router.route("/").get(getBooks).post(addBook);
router.route("/:id").get(getBook).patch(updateBook).delete(removeBook);
module.exports = router;
