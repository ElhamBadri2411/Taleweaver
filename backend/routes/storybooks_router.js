import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  createStoryBook,
  getStoryBookById,
  getStoryBooks,
  renameStoryBook,
  deleteStoryBook,
  generateStoryBook,
  getGenerationStatus,
} from "../controllers/storybooks_controller.js";

const storybookRouter = Router();

// TODO: ADD AUTH
storybookRouter.post("/", verifyToken, createStoryBook);
storybookRouter.post("/generate", verifyToken, generateStoryBook);
storybookRouter.get("/status/:id", verifyToken, getGenerationStatus);
storybookRouter.get("/users/:id", verifyToken, getStoryBooks);
storybookRouter.get("/:id", verifyToken, getStoryBookById);
storybookRouter.patch("/:id", verifyToken, renameStoryBook);
storybookRouter.delete("/:id", verifyToken, deleteStoryBook);

export default storybookRouter;
