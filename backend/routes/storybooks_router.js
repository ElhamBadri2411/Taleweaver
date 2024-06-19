import { Router } from "express";

import {
  createStoryBook,
  getStoryBookById,
  getStoryBooks,
  renameStoryBook,
  deleteStoryBook
} from "../controllers/storybooks_controller.js";

const storybookRouter = Router();

storybookRouter.post("/", createStoryBook);
storybookRouter.get("/users/:id", getStoryBooks);
storybookRouter.get("/:id", getStoryBookById);
storybookRouter.patch("/:id", renameStoryBook);
storybookRouter.delete("/:id", deleteStoryBook);

export default storybookRouter;