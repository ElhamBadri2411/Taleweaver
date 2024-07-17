import { Page } from "../models/page.js"
import { StoryBook } from "../models/storybook.js"
// Add authentication later

// @route POST api/pages/
// @desc  Create a new page
// @access private
const createPage = async (req, res, next) => {
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
    // const page = await Page.create({ paragraph, image });

    // For now, we will not include image
    const page = await Page.create({ paragraph, StoryBookId: storyBookId });
    book.changed('updatedAt', true);
    await book.save();
    res.status(201).json(page);
  } catch (error) {
    return res.status(400).json({ error: "Cannot create page" });
  }
}

// @route POST api/pages/new
// @desc Add an empty page to a storybook 
// @access private
const addPage = async (req, res, next) => {
  try {
    const { storyBookId } = req.body;
    const book = await StoryBook.findByPk(storyBookId);
    if (!book) {
      return res.status(404).json({ error: "StoryBook not found" });
    }

    const count = await Page.count({
      where: {
        StoryBookId: storyBookId
      }
    })


    const page = await Page.create({ StoryBookId: storyBookId, position: count + 1 });
    book.changed('updatedAt', true);
    await book.save();
    res.status(201).json(page);
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: "Cannot create page" });
  }
}

// @route DELETE api/pages/:id
// @desc  Delete a page by id
// @access private
const deletePage = async (req, res, next) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }
    await page.destroy();
    book.changed('updatedAt', true);
    await book.save();
    res.status(204).json();
  } catch (error) {
    return res.status(400).json({ error: "Cannot delete page" });
  }
}

// @route GET api/pages/:id
// @desc  Get a page by id
// @access private
const getPageById = async (req, res, next) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ error: "Pages not found" });
    }
    res.status(200).json(page);
  } catch (error) {
    return res.status(400).json({ error: "Cannot get page" });
  }
}

// @route GET api/pages/storybooks/:id
// @desc  Get all pages by a storybook id
// @access private
const getPagesByStoryBookId = async (req, res, next) => {
  try {
    const pages = await Page.findAll({
      where: { StoryBookId: req.params.id },
      order: [
        ['position', 'ASC']
      ]
    });
    if (!pages) {
      return res.status(404).json({ error: "Pages not found" });
    }
    res.status(200).json(pages);
  } catch (error) {
    return res.status(400).json({ error: "Cannot get pages" });
  }
}

// @route PATCH api/pages/:id
// @desc  Update a page by id
// @access private
const updatePage = async (req, res, next) => {
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
    const page = await Page.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }
    await page.update({
      paragraph: paragraph,
      // image: image,
    });
    await page.reload();

    const storyBook = await StoryBook.findByPk(page.StoryBookId);
    if (storyBook) {
      storyBook.changed('updatedAt', true);
      await storyBook.save();
    }
    res.status(200).json(page);
  } catch (error) {
    return res.status(400).json({ error: "Cannot update page" });
  }
}

export {
  createPage,
  deletePage,
  getPageById,
  getPagesByStoryBookId,
  updatePage,
  addPage
}
