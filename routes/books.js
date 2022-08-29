const express = require("express");
const router = express.Router();
const Book = require("../models").Books;
const { Op } = require("sequelize");
const createPages = require("../src/createPages");

/** GET new book form */
router.get("/new", async (req, res, next) => {
  res.render("new-book", { book: {} });
});

/** POST new book */
router.post("/new", async (req, res) => {
  try {
    await Book.create(req.body);
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

/** GET book id */
router.get("/:id", async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  book ? res.render("update-book", { book }) : next();
});

/** POST edit book */
router.post("/:id", async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    try {
      await book.update(req.body);
      res.redirect(`/`);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = await error.errors.map((err) => err.message);
        res.render("update-book", { book, errors });
      } else {
        throw error;
      }
    }
  } else {
    res.sendStatus(404);
  }
});

/** POST delete book */
router.post("/:id/delete", async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect("/");
});

/** GET books */
router.get("/", async (req, res, next) => {
  let books;
  const search = req.query.search;
  const page = parseInt(req.query.page);
  const activePage = page || 1;

  /** Remove empty search from url */
  if (search === "") return res.redirect("/");

  /** Return search results */
  if (search) {
    books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.substring]: search } },
          { author: { [Op.substring]: search } },
          { genre: { [Op.substring]: search } },
          { year: { [Op.substring]: search } },
        ],
      },
    });
    const pages = createPages(books);
    books = page ? pages[page - 1] : pages[0]; // default to page=1
    if (pages.length === 0) return res.render("no-results", { search });
    return res.render("index", { books, search, pages, activePage });
  }

  /** Return all books by page */
  books = await Book.findAll();
  const pages = createPages(books);
  books = page ? pages[page - 1] : pages[0];

  res.render("index", { books, pages, activePage });
});

module.exports = router;
