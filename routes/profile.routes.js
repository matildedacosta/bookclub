/* Middleware */
const router = require("express").Router();

/* Require the models */
const User = require("../models/User.model");

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
  res.render("user/friends-list");
});

/* Exports */
module.exports = router;
