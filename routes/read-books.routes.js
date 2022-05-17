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

//bookshelf view
router.get("/bookshelf", (req, res, next) => {
  User.findById(req.session.user)
    .populate("bookshelf")
    .then((currentUser) => {
      console.log(currentUser.bookshelf);
      res.render("books/bookshelf-books", { currentUser });
    });
});

//add books to bookshelf
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
      if (req.session.user.bookshelf.includes(bookFromApi)) {
        res.redirect("/");
      } else {
        Book.create({
          id: bookFromApi.id,
          title: bookFromApi.volumeInfo.title,
          author: bookFromApi.volumeInfo.author,
          categories: bookFromApi.volumeInfo.categories,
          description: bookFromApi.volumeInfo.description,
          publisher: bookFromApi.volumeInfo.publisher,
          publishedDate: bookFromApi.volumeInfo.publishedDate,
          averageRating: bookFromApi.volumeInfo.averageRating,
          /* imageUrl: bookFromApi.volumeInfo.imageLinks.thumbnail, */
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
      }
    });
});

/* Delete Book from Bookshelf */
router.get("/:id/remove", (req, res, next) => {
  const { id } = req.params;
  Book.findByIdAndRemove(id).then(() => {
    User.findByIdAndUpdate(req.session.user._id, {
      $pull: { bookshelf: id },
    })
      .then((currentUser) => {
        req.session.user = currentUser;
        res.redirect("/read-books/bookshelf");
      })
      .catch((err) => next(err));
  });
});

/* Favorite-books */

//favorite books view
router.get("/favorites", (req, res, next) => {
  User.findById(req.session.user)
    .populate("favoriteBooks")
    .then((currentUser) => {
      console.log(currentUser.favoriteBooks);
      res.render("books/favorite-books", { currentUser });
    });
});

//add to favorite books
router.get("/add-favorite-book/:id", (req, res, next) => {
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
      if (req.session.user.favoriteBooks.includes(bookFromApi)) {
        res.redirect("/");
      } else {
        Book.create({
          id: bookFromApi.id,
          title: bookFromApi.volumeInfo.title,
          author: bookFromApi.volumeInfo.author,
          categories: bookFromApi.volumeInfo.categories,
          description: bookFromApi.volumeInfo.description,
          publisher: bookFromApi.volumeInfo.publisher,
          publishedDate: bookFromApi.volumeInfo.publishedDate,
          averageRating: bookFromApi.volumeInfo.averageRating,
          imageUrl: bookFromApi.volumeInfo.imageLinks.thumbnail,
        }).then((book) => {
          User.findByIdAndUpdate(
            req.session.user._id,
            {
              $push: { favoriteBooks: book._id },
            },
            { new: true }
          ).then((updatedUser) => {
            req.session.user = updatedUser;
            res.redirect("/read-books/favorites");
          });
        });
      }
    });
});

//delete favorite book

router.get("/:id/remove-favorite", (req, res, next) => {
  const { id } = req.params;
  Book.findByIdAndRemove(id).then(() => {
    User.findByIdAndUpdate(req.session.user._id, {
      $pull: { favoriteBooks: id },
    })
      .then((currentUser) => {
        req.session.user = currentUser;
        res.redirect("/read-books/favorites");
      })
      .catch((err) => next(err));
  });
});

module.exports = router;
