import { Story } from "../models/story.js"
import { StoryBook } from "../models/storybook.js"
// Add authentication later

// @route POST api/stories/
// @desc  Create a new story
// @access private
const createStory = async (req, res, next) => {
  try {
    const { paragraph, image, storyBookId } = req.body;
    const book = await StoryBook.findByPk(storyBookId);
    if (!book) {
      return res.status(404).json({ error: "StoryBook not found" });
    }
    if (!paragraph || typeof paragraph !== "string" || paragraph.length === 0) {
      return res.status(422).json({
        error:
          "Invalid input parameters. Expected paragraph to be a string with length > 0",
      });
    }
    
    // if (!image || typeof image !== "object") {
    //   return res.status(422).json({
    //     error:
    //       "Invalid input parameters. Expected image to be an object",
    //   });
    // }
    // const story = await Story.create({ paragraph, image });

    // For now, we will not include image
    const story = await Story.create({ paragraph, StoryBookId: storyBookId});
    res.status(201).json(story);
  } catch (error) {
    return res.status(400).json({ error: "Cannot create story" });
  }
}

// @route DELETE api/stories/:id
// @desc  Delete a story by id
// @access private
const deleteStory = async (req, res, next) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }
    await story.destroy();
    res.status(204).json();
  } catch (error) {
    return res.status(400).json({ error: "Cannot delete story" });
  }
}

// @route GET api/stories/:id
// @desc  Get a story by id
// @access private
const getStoryById = async (req, res, next) => {
  try {
    const story = await Story.findByPk(req.params.id);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }
    res.status(200).json(story);
  } catch (error) {
    return res.status(400).json({ error: "Cannot get story" });
  }
}

// @route GET api/stories/storybook/:id
// @desc  Get all stories by a storybook id
// @access private
const getStoriesByStoryBookId = async (req, res, next) => {
  try {
    const stories = await Story.findAll({
      where: { StoryBookId: req.params.id },
    });
    if (!stories) {
      return res.status(404).json({ error: "Stories not found" });
    }
    res.status(200).json(stories);
  } catch (error) {
    return res.status(400).json({ error: "Cannot get stories" });
  }
}

// @route PATCH api/stories/:id
// @desc  Update a story by id
// @access private
const updateStory = async (req, res, next) => {
  try {
    const { paragraph, image } = req.body;
    if (!paragraph || typeof paragraph !== "string" || paragraph.length === 0) {
      return res.status(422).json({
        error:
          "Invalid input parameters. Expected paragraph to be a string with length > 0",
      });
    }
    // if (!image || typeof image !== "object") {
    //   return res.status(422).json({
    //     error:
    //       "Invalid input parameters. Expected image to be an object",
    //   });
    // }
    const story = await Story.findByPk(req.params.id);
    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }
    await story.update({
      paragraph: paragraph,
      // image: image,
    });
    await story.reload();
    res.status(200).json(story);
  } catch (error) {
    return res.status(400).json({ error: "Cannot update story" });
  }
}

export { 
    createStory, 
    deleteStory, 
    getStoryById,
    getStoriesByStoryBookId,
    updateStory
}