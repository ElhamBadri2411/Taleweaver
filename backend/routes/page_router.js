import { Router } from "express";

import {
    createPage, 
    deletePage, 
    getPageById, 
    getPagesByStoryBookId, 
    updatePage,
  addPage
    } from "../controllers/page_controller.js";

const pageRouter = Router();

pageRouter.post("/", createPage);
pageRouter.post("/new", addPage);
pageRouter.delete("/:id", deletePage);
pageRouter.get("/:id", getPageById);
pageRouter.get("/storybook/:id", getPagesByStoryBookId);
pageRouter.patch("/:id", updatePage);

export default pageRouter;

