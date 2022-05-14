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
  const { id } = req.params;
  User.findById(id)
    .populate("friendsList")
    .then((friends) => {
      res.render("user/friends-list", { friends });
    })
    .catch((err) => next(err));
  //res.render("user/friends-list");
});

/* Friends Add- friends*/
router.get("/add-friend/:id", (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((userId) => {
      return User.findByIdAndUpdate(req.session.currentUser, {
        $push: { friendsList: userId },
      }).then(() => {
        res.render("search/friends-details");
      });
    })
    .catch((err) => next(err));

  res.render("user/friends-list");
});

/* Add-Friends-populate */
/* router.get("/add-friend/:id", (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .populate("friendsList")
    .then((friends) => {
      res.render({ friendsList });
    })
    .catch((err) => next(err));
}); */

/* Exports */
module.exports = router;
