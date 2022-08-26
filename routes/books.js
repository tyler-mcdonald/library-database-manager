var express = require("express");
var router = express.Router();
const Book = require("../models").Book;

/** GET new book page */
router.get("/new", async function (req, res, next) {
  res.render("new-book", { book: {} });
});

/** POST new book */
router.post("/new", async function (req, res) {
  try {
    const book = await Book.create(req.body);
    res.redirect(`/`);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const book = await Book.build(req.body);
      const errors = error.errors.map((err) => err.message);
      res.render("new-book", { book, errors });
    } else {
      throw error;
    }
  }
});

/** GET book by id */
router.get("/:id", async function (req, res, next) {
  const book = await Book.findByPk(req.params.id);
  res.render("update-book", { book });
});

/** POST update book info by id */
router.post("/:id", async function (req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect(`/`);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const book = await Book.build(req.body);
      const errors = error.errors.map((err) => err.message);
      res.render("update-book", { book, errors });
    } else {
      throw error;
    }
  }
});

/** POST delete book by id */
router.post("/:id/delete", async function (req, res, next) {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect("/");
});

/** GET books page */
router.get("/", async function (req, res, next) {
  const books = await Book.findAll();
  res.render("index", { title: "Library Database", books });
});

module.exports = router;
