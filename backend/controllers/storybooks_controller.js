import { StoryBook } from "../models/storybook.js";

// Add authentication later

// @route POST api/storybooks/
// @desc  Create a new storybook
// @access private
const createStoryBook = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string" || title.length === 0) {
      return res.status(422).json({
        error:
          "Invalid input parameters. Expected title to be a string with length > 0",
      });
    }
    const storyBook = await StoryBook.create({ title });
    res.status(201).json(storyBook);
  } catch (error) {
    return res.status(400).json({ error: "Cannot create storyBook" });
  }
}

// @route GET api/storybooks/:id
// @desc  Get a storybook by id
// @access private
const getStoryBookById = async (req, res, next) => {
  try {
    const storyBook = await StoryBook.findByPk(req.params.id);
    if (!storyBook) {
      return res.status(404).json({ error: "StoryBook not found" });
    }
    res.status(200).json(storyBook);
  } catch (error) {
    return res.status(400).json({ error: "Cannot get storyBook" });
  }
}

// @route GET api/storybooks/user/:id
// @desc  Get all storybook by a user
// @access private
const getStoryBooks = async (req, res, next) => {
  try {
    const books = await StoryBook.findAll({
      where: { UserId: req.params.id },
    });
    if (!books) {
      return res.status(404).json({ error: "Books not found" });
    }
    res.status(200).json(books);
  } catch (error) {
    return res.status(400).json({ error: "Cannot get books" });
  }
}

// @route PATCH api/storybooks/:id
// @desc  Rename a storybook
// @access private
const renameStoryBook = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string" || title.length === 0) {
      return res.status(422).json({
        error:
          "Invalid input parameters. Expected title to be a string with length > 0",
      });
    }
    const storyBook = await StoryBook.findByPk(req.params.id);
    if (!storyBook) {
      return res.status(404).json({ error: "StoryBook not found" });
    }
    await storyBook.update({
      title: title,
    });
    await storyBook.reload();
    res.status(200).json(storyBook);
  } catch (error) {
    return res.status(400).json({ error: "Cannot rename storyBook" });
  }
}

// @route DELETE api/storybooks/:id
// @desc  Delete a storybook
// @access private
const deleteStoryBook = async (req, res, next) => {
  try {
    const storyBook = await StoryBook.findByPk(req.params.id);
    if (!storyBook) {
      return res.status(404).json({ error: "StoryBook not found" });
    }
    await storyBook.destroy();
    res.status(204).json();
  } catch (error) {
    return res.status(400).json({ error: "Cannot delete storyBook" });
  }
}


export {
  createStoryBook,
  getStoryBookById,
  getStoryBooks,
  renameStoryBook,
  deleteStoryBook
}
