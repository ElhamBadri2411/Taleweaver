import { Book } from "../models/book.js";

// @route POST api/books/
// @desc  Create a new storybook
// @access private
const createBook = async (req, res, next) => {
  // TODO: Implement
}

// @route GET api/books/:id
// @desc  Get a book by id
// @access private
const getBookById = async (req, res, next) => {
  // TODO: Implement
}

// @route GET api/books/user/:id
// @desc  Get all books by a user
// @access private
const getBooks = async (req, res, next) => {
  // TODO: Implement
}

// @route PATCH api/books/:id
// @desc  Edit a book
// @access private
const editBook = async (req, res, next) => {
  // TODO: Implement
}

// @route DELETE api/books/:id
// @desc  Delete a book
// @access private
const deleteBook = async (req, res, next) => {
  // TODO: Implement
}


export {
  createBook,
  getBookById,
  getBooks,
  editBook,
  deleteBook
}
