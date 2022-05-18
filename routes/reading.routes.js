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

/* reading-books */

//reading books view
router.get("/reading", isLoggedIn, (req, res, next) => {
  User.findById(req.session.user)
    .populate("reading")
    .then((user) => {
      //Weeeeeeeeeeee  🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀
      res.render("books/reading", { user });
    });
});

//add to reading books
router.get("/add-reading-book/:id", isLoggedIn, (req, res, next) => {
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
      if (req.session.user.reading.includes(bookFromApi)) {
        res.redirect("/");
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
              $push: { reading: book._id },
            },
            { new: true }
          ).then((updatedUser) => {
            req.session.user = updatedUser;
            res.redirect("/reading");
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
              $push: { reading: book._id },
            },
            { new: true }
          ).then((updatedUser) => {
            req.session.user = updatedUser;
            res.redirect("/reading");
          });
        });
      }
    });
});

//delete favorite book
router.get("/:id/remove-reading", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  User.findByIdAndUpdate(req.session.user._id, {
    $pull: { reading: id },
  })
    .then((currentUser) => {
      req.session.user = currentUser;
      req.app.locals.currentUser = currentUser;

      res.redirect("/reading");
    })
    .catch((err) => next(err));
});

router.post("/reading/:id", (req, res, next) => {
  const { id } = req.params;
  const { currentPage } = req.body;

  console.log(id, currentPage);

  Book.findByIdAndUpdate(id, { currentPage: currentPage }, { new: true })
    .then((updatedBook) => {
      console.log(updatedBook);
      res.redirect("/reading");
    })
    .catch((err) => console.log(err));
});

router.get("/:id/remove-reading", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  Book.findByIdAndRemove(id).then(() => {
    User.findByIdAndUpdate(req.session.user._id, {
      $pull: { reading: id },
    })
      .then((currentUser) => {
        req.session.user = currentUser;
        req.app.locals.currentUser = currentUser;

        res.redirect("/reading");
      })
      .catch((err) => next(err));
  });
});

module.exports = router;
