/* Middleware */
const router = require("express").Router();

/* Require the models */
const User = require("../models/User.model");

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
