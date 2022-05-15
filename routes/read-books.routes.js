/* Middleware */
const router = require("express").Router();
const axios = require("axios").default;

/* Require the models */
const User = require("../models/User.model");
const Book = require("../models/Book.model");

/* Middleware */
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* Bookshelf */

router.get("/bookshelf", (req, res, next) => {
  res.render("books/bookshelf-books");
});

router.get("/book-details/:id", (req, res, next) => {
  const { id } = req.params;

  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`, {
      headers: {
        authorization: `${process.env.API_KEY}`,
      },
    })
    .then(() => {
      Book.create({
        id,
        title,
        author,
        categories,
        description,
        publisher,
        publishedDate,
        averageRating,
        imageUrl,
      }).then((book) => {
        res.redirect("/read-books/bookshelf"), { book };
      });
    });
});

/* Favorite-books */

router.get("/favorites", (req, res, next) => {
  res.render("books/favorite-books");
});

module.exports = router;
