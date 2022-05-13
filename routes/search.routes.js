/* Middleware */
const router = require("express").Router();

/* Require the models */
const User = require("../models/User.model");
const Book = require("../models/Book.model");
const Reccommendations = require("../models/Reccommendations.model");
/* const axios = require("axios").default; */

/* Middleware */
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { default: axios } = require("axios");
const res = require("express/lib/response");

/* Books search */

router.get("/books", (req, res, next) => {
  res.render("search/search-books");
});

/* axios
  .get(`https://www.googleapis.com/books/v1/volumes?q=${searchBooks}`)
  .then(() => res.render("books/search-books"))
  .catch((err) => next(err)); */

/* router.get("/", (req, res, next) => {
  const { searchBooks } = req.body;
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchBooks}`, {
    params,
  });
}); */

//List of book results

router.get("/book-results", (req, res, next) => {
  res.render("search/book-results");
});

//Details of book

router.get("/book-details", (req, res, next) => {
  res.render("search/book-details");
});

/* Friends search */

router.get("/friends", (req, res, next) => {
  res.render("search/search-friends");
});

//List of friend results

router.get("/friends-results", (req, res, next) => {
  res.render("search/friends-results");
});

//Details of book

router.get("/friends-details", (req, res, next) => {
  res.render("search/friends-details");
});

/* Exports */
module.exports = router;
