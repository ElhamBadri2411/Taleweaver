import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  createStoryBook,
  getStoryBookById,
  getStoryBooks,
  renameStoryBook,
  deleteStoryBook
} from "../controllers/storybooks_controller.js";

const storybookRouter = Router();

storybookRouter.post("/", verifyToken, createStoryBook);
storybookRouter.get("/users/:id", verifyToken, getStoryBooks);
storybookRouter.get("/:id", verifyToken, getStoryBookById);
storybookRouter.patch("/:id", verifyToken, renameStoryBook);
storybookRouter.delete("/:id", verifyToken, deleteStoryBook);

export default storybookRouter;