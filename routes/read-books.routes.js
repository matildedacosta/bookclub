/* Middleware */
const router = require("express").Router();
const axios = require("axios").default;

/* Require the models */
const User = require("../models/User.model");
const Book = require("../models/Book.model");

/* Middleware */
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { response } = require("express");

/* Bookshelf */

router.get("/bookshelf", (req, res, next) => {
  user.findbyif;
  res.render("books/bookshelf-books");
});

router.get("/add-bookshelf/:id", (req, res, next) => {
  const { id } = req.params;

  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`, {
      headers: {
        authorization: `${process.env.API_KEY}`,
      },
    })
    .then((response) => {
      console.log("aqui", response.data);
      const bookFromApi = response.data;
      Book.create({
        id: bookFromApi.id,
        title: bookFromApi.volumeInfo.title,
      }).then((book) => {
        User.findByIdAndUpdate(
          req.session.user._id,
          {
            $push: { bookshelf: book._id },
          },
          { new: true }
        ).then((updatedUser) => {
          req.session.user = updatedUser;
          res.redirect("/read-books/bookshelf");
        });
      });
    });
});

/* Favorite-books */

router.get("/favorites", (req, res, next) => {
  res.render("books/favorite-books");
});

module.exports = router;
