import { Router } from "express";

import {
  createBook,
  getBookById,
  getBooks,
  editBook,
  deleteBook
} from "../controllers/books_controller.js"

const router = Router()

router.post("/", createBook)
router.get("/users/:id", getBooks)
router.get("/:id", getBookById)
router.patch("/:id", editBook)
router.delete("/:id", deleteBook)

export default router
