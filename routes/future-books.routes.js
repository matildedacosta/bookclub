/* Middleware */
const router = require("express").Router();

/* Require the models */
const User = require("../models/User.model");

/* Middleware */
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* Wishlist */

router.get("/wishlist", (req, res, next) => {
  res.render("books/wishlist-books");
});

/* Reccommended-books */

router.get("/reccommendations", (req, res, next) => {
  res.render("books/reccommended-books");
});

module.exports = router;
