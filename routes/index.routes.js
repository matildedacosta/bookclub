const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  console.log(req.app.locals);
  res.render("index");
});

module.exports = router;
