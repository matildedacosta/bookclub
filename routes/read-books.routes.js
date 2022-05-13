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



/* Favorite-books */

router.get("/favorites", (req, res, next) => {
  res.render("books/favorite-books");
});

module.exports = router;
