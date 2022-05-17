/* Middleware */
const router = require("express").Router();
const axios = require("axios").default;

/* Require the models */
const User = require("../models/User.model");
const Book = require("../models/Book.model");
const Reccommendations = require("../models/Reccommendations.model");

/* Middleware */
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* Wishlist */

//route for wishlist view
router.get("/wishlist", (req, res, next) => {
  User.findById(req.session.user)
    .populate("wishlist")
    .then((currentUser) => {
      res.render("books/wishlist-books", { currentUser });
    });
});

//route to add books to wishlist
router.get("/add-wishlist/:id", (req, res, next) => {
  const { id } = req.params;

  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`, {
      headers: {
        authorization: `${process.env.API_KEY}`,
      },
    })
    .then((response) => {
      const bookFromApi = response.data;
      if (req.session.user.wishlist.includes(bookFromApi)) {
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
              $push: { wishlist: book._id },
            },
            { new: true }
          ).then((updatedUser) => {
            req.session.user = updatedUser;
            res.redirect("/future-books/wishlist");
          });
        });
      }
    });
});

//route to remove books from wishlist

router.get("/:id/remove-wishlist", (req, res, next) => {
  const { id } = req.params;
  User.findByIdAndUpdate(req.session.user._id, {
    $pull: { wishlist: id },
  })
    .then((currentUser) => {
      req.session.user = currentUser;
      res.redirect("/future-books/wishlist");
    })
    .catch((err) => next(err));
});

/* Reccommended-books */

router.get("/reccommendations", (req, res, next) => {


  res.render("books/reccommended-books",  { currentUser: req.session.user });

});






module.exports = router;
