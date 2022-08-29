const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

/** Routers */
const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");

const app = express();

/** Views */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

/** Others */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/** Remove trailing '/' in url */
app.use((req, res, next) => {
  if (req.path.slice(-1) === "/" && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});

/** Routes */
app.use("/", indexRouter);
app.use("/books", booksRouter);

/** 404 error handler */
app.use((req, res, next) => {
  const error = createError(404, "Page Not Found");
  next(error);
});

/** Global error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render(err.status === 404 ? "page-not-found" : "error", {
    error: req.app.get("env") === "development" ? err : {},
    title: err.message,
    message: err.message,
  });
});

module.exports = app;
