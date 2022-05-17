/* Middleware */
const router = require("express").Router();

/* Require the models */
const User = require("../models/User.model");
const Book = require("../models/Book.model");
const Reccommendations = require("../models/Reccommendations.model");
const axios = require("axios");

/* Middleware */
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

//BOOKS:
/* Books search */
router.get("/books", (req, res, next) => {
  res.render("search/search-books", { currentUser: req.session.user });
});

//route that does the search
router.get("/search-books", (req, res, next) => {
  const { q, o } = req.query;

  q.split(" ").join("+");

  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=40&orderBy=${o}&key=${process.env.API_KEY}`
    )
    .then((results) => {
      res.render(
        "search/book-results",
        { items: results.data.items }
        /*  { currentUser: req.session.user } */
      );
    })
    .catch((err) => next(err));
});

//List of book results page

router.get("/book-results", (req, res, next) => {
  res.render("search/book-results");
});

//Details of book

router.get("/book-details/:id", (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`, {
      headers: {
        authorization: `${process.env.API_KEY}`,
      },
    })
    .then((results) => {
      res.render("search/book-details", { book: results.data });
    })
    .catch((err) => next(err));
});

//FRIENDS:
/* Friends search */
router.get("/friends", (req, res, next) => {
  res.render("search/search-friends", {currentUser: req.session.user});
});

//Searching friends
router.get("/search-friends", (req, res, next) => {
  const { qfriend } = req.query;
  User.find({ username: qfriend })
    .then((user) => res.render("search/friends-results", { user }))
    .catch((err) => next(err));
});

//List of friend results
router.get("/friends-results", (req, res, next) => {
  console.log(req.session.user);
  res.render("search/friends-results");
});

//Details of friend
router.get("/friends-details/:id", (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      res.render("search/friends-details", { user });
    })
    .catch((err) => next(err));
});

/* Exports */
module.exports = router;
