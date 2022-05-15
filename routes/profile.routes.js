/* Middleware */
const router = require("express").Router();

/* Require the models */
const User = require("../models/User.model");
const Book = require("../models/Book.model");
const Reccommendations = require("../models/Reccommendations.model");

/* Middleware */
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* User profile */

router.get("/", (req, res, next) => {
  res.render("user/profile");
});

/* Edit profile */
router.get("/edit", (req, res, next) => {
  res.render("user/edit-profile");
});

/* Friends list */
router.get("/friends", (req, res, next) => {
  const id = req.session.user._id;
  User.findById(id)
    .populate("friendsList")
    .then((currentUser) => {
      res.render("user/friends-list", { currentUser });
    })
    .catch((err) => next(err));
  //res.render("user/friends-list");
});

/* Friends Add- friends*/
router.get("/add-friend/:id", (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((userId) => {
      return User.findByIdAndUpdate(req.session.user, {
        $push: { friendsList: userId },
      }).then(() => {
        res.render("search/friends-details");
      });
    })
    .catch((err) => next(err));

  res.render("user/friends-list");
});

/* Exports */
module.exports = router;
