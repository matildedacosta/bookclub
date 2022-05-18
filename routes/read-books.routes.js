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
  User.findById(req.session.user._id)
    .populate("bookshelf")
    .then((user) => {
      console.log(user.bookshelf);
      res.render("books/bookshelf-books", { user });
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
        res.redirect("/profile");
      } else if (!bookFromApi.volumeInfo.imageLinks) {
        Book.create({
          id: bookFromApi.id,
          title: bookFromApi.volumeInfo.title,
          author: bookFromApi.volumeInfo.author,
          categories: bookFromApi.volumeInfo.categories,
          description: bookFromApi.volumeInfo.description,
          publisher: bookFromApi.volumeInfo.publisher,
          publishedDate: bookFromApi.volumeInfo.publishedDate,
          averageRating: bookFromApi.volumeInfo.averageRating,
        }).then((book) => {
          User.findByIdAndUpdate(
            req.session.user._id,
            {
              $push: { bookshelf: book._id },
            },
            { new: true }
          ).then((updatedUser) => {
            req.session.user = updatedUser;
            res.redirect("/future-books/bookshelf");
          });
        });
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
              $push: { bookshelf: book._id },
            },
            { new: true }
          ).then((updatedUser) => {
            req.session.user = updatedUser;
            res.redirect("/future-books/bookshelf");
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
        req.app.locals.currentUser = currentUser;
        res.redirect("/read-books/bookshelf");
      })
      .catch((err) => next(err));
  });
});

/* Favorite-books */

//favorite books view
router.get("/favorites", (req, res, next) => {
  User.findById(req.session.user._id)
    .populate("favoriteBooks")
    .then((user) => {
      console.log(user.favoriteBooks);
      res.render("books/favorite-books", { user });
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
      } else if (bookFromApi.volumeInfo.imageLinks === undefined) {
        Book.create({
          id: bookFromApi.id,
          title: bookFromApi.volumeInfo.title,
          author: bookFromApi.volumeInfo.author,
          categories: bookFromApi.volumeInfo.categories,
          description: bookFromApi.volumeInfo.description,
          publisher: bookFromApi.volumeInfo.publisher,
          publishedDate: bookFromApi.volumeInfo.publishedDate,
          averageRating: bookFromApi.volumeInfo.averageRating,
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
        req.app.locals.currentUser = currentUser;

        res.redirect("/read-books/favorites");
      })
      .catch((err) => next(err));
  });
});

module.exports = router;
