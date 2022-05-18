/* Middleware */
const router = require("express").Router();

/* Require the models */
const User = require("../models/User.model");
const Book = require("../models/Book.model");
const Reccommendations = require("../models/Reccommendations.model");

/* REQUIRE CONFIG TO CHANGE PICTURE */
const fileUploader = require("../config/cloudinary.config");

/* Middleware */
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* User profile */
router.get("/profile", (req, res, next) => {
  const user = req.session.user._id;
  User.findById(user)
    .then((currentUser) => {
      req.session.user = currentUser;
      res.render("user/profile");
    })
    .catch((err) => next(err));
});

/* Edit profile - get */
router.get(
  "/:id/edit",
  fileUploader.single("profile-image"),
  (req, res, next) => {
    const user = req.session.user._id;
    console.log(user);
    User.findById(user)
      .then((currentUser) => {
        req.app.locals.currentUser = currentUser;
        
        res.render("user/edit-profile");
      })
      .catch((err) => next(err));
  }
);

/* Edit profile - post */
router.post("/:id/edit", fileUploader.single("imageUrl"), (req, res, next) => {
  const { id } = req.params;
  const { name, username, description } = req.body;

  if (req.file) {
    User.findByIdAndUpdate(
      id,
      { name, username, description, imageUrl: req.file.path },
      { new: true }
    )
      .then((updatedUser) => {
        req.app.locals.currentUser = updatedUser;

        req.session.user = updatedUser;
        console.log(updatedUser);
        res.redirect("/profile");
      })
      .catch((err) => next(err));
  } else {
    User.findByIdAndUpdate(id, { name, username, description }, { new: true })
      .then((updatedUser) => {
        req.app.locals.currentUser = updatedUser;

        req.session.user = updatedUser;
        console.log(updatedUser);
        res.redirect("/profile");
      })
      .catch((err) => next(err));
  }
});

/* DELETE PROFILE */

router.post("/:id/delete", (req, res, next) => {
  const { id } = req.params;
  req.app.locals.currentUser = null;
  req.session.destroy();
  User.findByIdAndRemove(id)
    .then(() => res.redirect("/"))
    .catch((err) => next(err));
});

/* Friends list */
router.get("/friends", (req, res, next) => {
  const user = req.session.user._id;
  console.log(user);
  User.findById(user)
    .populate("friendsList")
    .then((user) => {
      res.render("user/friends-list", { user });
    })
    .catch((err) => next(err));
  //res.render("user/friends-list");
});

/* Friends Add- friends*/
router.get(
  "/add-friend/:id",
  (req, res, next) => {
    const { id } = req.params;
    console.log("params", id);

    console.log("list", req.session.user.friendsList);
    if (req.session.user.friendsList.includes(id)) {
      res.redirect("/");
      return;
    }

    User.findByIdAndUpdate(
      req.session.user._id,
      {
        $push: { friendsList: id },
      },
      { new: true }
    )
      .then((currentUser) => {
        req.session.user = currentUser;
        req.app.locals.currentUser = currentUser;
        res.redirect("/friends");
      })
      .catch((err) => next(err));
  }

  //res.render("user/friends-list");
);

/* Delete friends */

router.get("/remove-friend/:id", (req, res, next) => {
  const { id } = req.params;
  User.findByIdAndUpdate(
    req.session.user._id,
    {
      $pull: { friendsList: id },
    },
    { new: true }
  )
    .then((currentUser) => {
      req.session.user = currentUser;
      req.app.locals.currentUser = currentUser;
      res.redirect("/");
    })
    .catch((err) => next(err));
});

/* Exports */
module.exports = router;
