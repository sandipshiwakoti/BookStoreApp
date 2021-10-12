const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    publisher: {
      type: String,
      required: [true, "Publisher is required"],
    },
    category: {
      type: String,
      enum: ["programming", "history", "horror", "fiction", "children"],
      required: [true, "Category is required"],
    },
    ISBN: {
      type: Number,
      minlength: 8,
      default: 00000000,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
