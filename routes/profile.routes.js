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
router.get("/profile", (req, res, next) => {
  const user = req.session.user._id;
  User.findById(user)
    .then((currentUser) => {
      res.render("user/profile", { currentUser });
    })
    .catch((err) => next(err));
});

/* Edit profile - get */
router.get("/:id/edit", (req, res, next) => {
  const user = req.session.user._id;
  console.log(user);
  User.findById(user)
    .then((user) => {
      res.render("user/edit-profile", { user });
    })
    .catch((err) => next(err));
});

/* Edit profile - put */
router.post("/:id/edit", (req, res, next) => {
  const { user } = req.session.user._id;
  const { name, username, description, imageUrl } = req.body;

  User.findByIdAndUpdate(user, { name, username, description, imageUrl })
    .then((user) => res.redirect("/profile"))
    .catch((err) => next(err));
});

/* Friends list */
router.get("/friends", (req, res, next) => {
  const user = req.session.user._id;
  console.log(user);
  User.findById(user)
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
      if (req.session.user.friendsList.includes(userId)) {
        return;
      } else {
        return User.findByIdAndUpdate(req.session.user, {
          $push: { friendsList: userId },
        }).then(() => {
          res.render("search/friends-details");
        });
      }
    })
    .catch((err) => next(err));

  //res.render("user/friends-list");
});

/* Delete friends */

router.get("/remove-friend/:id", (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((userId) => {
      User.findByIdAndUpdate(req.session.user, {
        $pull: { friendsList: userId },
      }).then(() => {
        res.render("user/friends-list");
      });
    })
    .catch((err) => next(err));
});

/* Exports */
module.exports = router;
