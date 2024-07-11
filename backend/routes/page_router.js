import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  createPage,
  deletePage,
  getPageById,
  getPagesByStoryBookId,
  updatePage,
  addPage
} from "../controllers/page_controller.js";

const pageRouter = Router();

pageRouter.post("/", verifyToken, createPage);
pageRouter.post("/new", verifyToken, addPage);
pageRouter.delete("/:id", verifyToken, deletePage);
pageRouter.get("/:id", verifyToken, getPageById);
pageRouter.get("/storybooks/:id", verifyToken, getPagesByStoryBookId);
pageRouter.patch("/:id", verifyToken, updatePage);

export default pageRouter;

