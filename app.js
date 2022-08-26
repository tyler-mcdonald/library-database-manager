const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const booksRouter = require("./routes/books");

const sequelize = require("./models").sequelize;

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/** Redirect trailing '/' slashes */
app.use((req, res, next) => {
  console.log(req.path.slice(-1));

  if (req.path.slice(-1) === "/" && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
    res.redirect(301, safepath + query);
  } else {
    next();
  }
});

app.use("/", indexRouter);
app.use("/books", booksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const error = createError(404, "Page Not Found");
  next(error);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get("enreq.app.get("env") === "development" ? err : {}v") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    error: req.app.get("env") === "development" ? err : {},
    title: err.message,
    message: err.message,
  });
});

module.exports = app;
