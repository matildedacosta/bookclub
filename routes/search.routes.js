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

/* Books search */

router.get("/books", (req, res, next) => {
  res.render("search/search-books");
});

router.get("/search-books", (req, res, next) => {
  const { q } = req.query;
  //console.log(process.env.API_KEY);

  q.split(" ").join("+");

  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${process.env.API_KEY}`
    )
    .then((results) => {
      console.log(results.data);
      res.render("search/book-results", { items: results.data.items });
    })
    .catch((err) => next(err));
});

//List of book results

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
      console.log(results.data);
      res.render("search/book-details");
    })
    .catch((err) => next(err));
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
