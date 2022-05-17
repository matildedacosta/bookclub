// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

hbs.registerHelper("divide", function (a, b) {
  return Math.floor((a / b) * 100);
});

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalized = require("./utils/capitalized");
const projectName = "bookclub";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

/* PROFILE */
const profileRoutes = require("./routes/profile.routes");
app.use("/", profileRoutes);

/* BOOKS */
/* Read Books Route*/
const readBooksRoutes = require("./routes/read-books.routes");
app.use("/read-books", readBooksRoutes);
/* Future Books Route */
const futureBooksRoutes = require("./routes/future-books.routes");
app.use("/future-books", futureBooksRoutes);
/* Reading Books Route */
const readingRoutes = require("./routes/reading.routes");
app.use("/", readingRoutes);

/* SEARCH */
const searchRoutes = require("./routes/search.routes");
app.use("/search", searchRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
