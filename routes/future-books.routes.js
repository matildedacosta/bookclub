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
router.get("/wishlist", isLoggedIn, (req, res, next) => {
  User.findById(req.session.user._id)
    .populate("wishlist")
    .then((user) => {
      res.render("books/wishlist-books", { user });
    })
    .catch((err) => next(err));
});

//route to add books to wishlist
router.get("/add-wishlist/:id", isLoggedIn, (req, res, next) => {
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
              $push: { wishlist: book._id },
            },
            { new: true }
          ).then((updatedUser) => {
            req.session.user = updatedUser;
            res.redirect("/future-books/wishlist");
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

router.get("/:id/remove-wishlist", isLoggedIn, (req, res, next) => {
  const { id } = req.params;

  Book.findByIdAndRemove(id).then(() => {
    User.findByIdAndUpdate(req.session.user._id, {
      $pull: { wishlist: id },
    })
      .then((currentUser) => {
        req.session.user = currentUser;
        req.app.locals.currentUser = currentUser;
        res.redirect("/future-books/wishlist");
      })
      .catch((err) => next(err));
  });
});

/* Reccommended-books */

//view for when book is reccommended
router.get("/reccommendations", isLoggedIn, (req, res, next) => {
  User.findById(req.session.user._id)
    .populate({
      path: "reccommended",
      populate: { path: "book reccommendedBy" },
    })
    .then((user) => {
      user.reccommended.forEach((item) => console.log(item.book.title));

      res.render("books/reccommended-books", { user });
    })
    .catch((err) => next(err));
});

//view for reccommend book
router.get("/:id/reccommend", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  let user;
  User.findById(req.session.user._id)
    .populate("friendsList")
    .then((userFromDb) => {
      user = userFromDb;
      axios
        .get(`https://www.googleapis.com/books/v1/volumes/${id}`, {
          headers: {
            authorization: `${process.env.API_KEY}`,
          },
        })
        .then((results) => {
          res.render("books/reccommend-books", { book: results.data, user });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

/* router.get("/:id/reccommend", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(() => {
      res.render("books/reccommend-books");
    })
    .catch((err) => next(err));
}); */

router.post("/:id/reccommend", (req, res, next) => {
  const { id } = req.params;
  const { friends, bookID } = req.body;

  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${bookID}`, {
      headers: {
        authorization: `${process.env.API_KEY}`,
      },
    })
    .then((response) => {
      const bookFromApi = response.data;
      return Book.create({
        id: bookFromApi.id,
        title: bookFromApi.volumeInfo.title,
        author: bookFromApi.volumeInfo.author,
        categories: bookFromApi.volumeInfo.categories,
        description: bookFromApi.volumeInfo.description,
        publisher: bookFromApi.volumeInfo.publisher,
        publishedDate: bookFromApi.volumeInfo.publishedDate,
        averageRating: bookFromApi.volumeInfo.averageRating,
        imageUrl: bookFromApi.volumeInfo.imageLinks.thumbnail,
      });
    })
    .then((createdBook) => {
      User.findById(friends).then((foundUser) => {
        /* console.log("yo", foundUser); */
        if (foundUser.reccommended.includes(createdBook._id)) {
          res.redirect("/");
        } else {
          Reccommendations.create({
            book: createdBook._id,
            reccommendedBy: id,
            reccommendedTo: friends,
          }).then((book) => {
            User.findByIdAndUpdate(
              friends,
              {
                $push: { reccommended: book._id },
              },
              { new: true }
            ).then(() => {
              res.redirect("/profile");
            });
          });
        }
      });
    })

    .catch((err) => next(err));
});

module.exports = router;
