import { Router } from "express";

import {
    createPage, 
    deletePage, 
    getPageById, 
    getPagesByStoryBookId, 
    updatePage
    } from "../controllers/page_controller.js";

const pageRouter = Router();

pageRouter.post("/", createPage);
pageRouter.delete("/:id", deletePage);
pageRouter.get("/:id", getPageById);
pageRouter.get("/storybook/:id", getPagesByStoryBookId);
pageRouter.patch("/:id", updatePage);

export default pageRouter;

