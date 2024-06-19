import { Router } from "express";

import {
    createStory, 
    deleteStory, 
    getStoryById,
    getStoriesByStoryBookId,
    updateStory
    } from "../controllers/story_controller.js";

const storyRouter = Router();

storyRouter.post("/", createStory);
storyRouter.delete("/:id", deleteStory);
storyRouter.get("/:id", getStoryById);
storyRouter.get("/storybook/:id", getStoriesByStoryBookId);
storyRouter.patch("/:id", updateStory);

export default storyRouter;

