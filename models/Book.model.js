const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const bookSchema = new Schema(
  {
    id: {
      type: String,
    },
    title: {
      type: String,
    },
    author: {
      type: [String],
    },
    categories: {
      type: [String],
    },
    description: {
      type: String,
      default: "I am a booklover! Do you want to be my bookfriend?",
    },
    publisher: {
      type: String,
    },
    publishedDate: {
      type: String,
    },
    averageRating: {
      type: Number,
    },
    pageCount: {
      type: Number,
    },
    currentPage: {
      type: Number,
    },
    imageUrl: {
      type: String,
      default: "https://biblioottawalibrary.ca/sites/default/files/book.png",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Book = model("Book", bookSchema);

module.exports = Book;
