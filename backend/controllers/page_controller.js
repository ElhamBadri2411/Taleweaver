import { Page } from "../models/page.js";
import { StoryBook } from "../models/storybook.js";
import { Access } from "../models/access.js";
import db from "../utils/db.js"

// Add authentication later

// @route POST api/pages/
// @desc  Create a new page
// @access private
const createPage = async (req, res, next) => {
  try {
    const { paragraph, storyBookId } = req.body;
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
    const access = await Access.findOne({
      where: {
        googleId: req.userId,
        storyBookId: storyBookId,
      },
    });
    if (!access || access.length === 0) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const page = await Page.create({ paragraph, StoryBookId: storyBookId });
    book.changed("updatedAt", true);
    await book.save();
    res.status(201).json(page);
  } catch (error) {
    return res.status(400).json({ error: "Cannot create page" });
  }
};

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

    const access = await Access.findOne({
      where: {
        googleId: req.userId,
        storyBookId: storyBookId,
      },
    });
    if (!access || access.length === 0) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const count = await Page.count({
      where: {
        StoryBookId: storyBookId,
      },
    });

    const page = await Page.create({
      StoryBookId: storyBookId,
      position: count + 1,
    });
    book.changed("updatedAt", true);
    await book.save();
    res.status(201).json(page);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Cannot create page" });
  }
};

// @route DELETE api/pages/:id
// @desc  Delete a page by id
// @access private
const deletePage = async (req, res, next) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    const access = await Access.findOne({
      where: {
        googleId: req.userId,
        storyBookId: page.StoryBookId,
      },
    });
    if (!access || access.length === 0) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await page.destroy();

    const storyBook = await StoryBook.findByPk(page.StoryBookId);
    if (storyBook) {
      storyBook.changed("updatedAt", true);
      await storyBook.save();
    }
    res.status(204).json(page);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Cannot delete page" });
  }
};

// @route GET api/pages/:id
// @desc  Get a page by id
// @access private
const getPageById = async (req, res, next) => {
  try {
    const page = await Page.findByPk(req.params.id, { include: StoryBook });
    if (!page) {
      return res.status(404).json({ error: "Pages not found" });
    }

    const access = await Access.findOne({
      where: {
        googleId: req.userId,
        storyBookId: page.StoryBookId,
      },
    });

    if (!access || access.length === 0) {
      if (!page.StoryBook.public) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    res.status(200).json(page);
  } catch (error) {
    console.log("\n\n" + error);
    return res.status(400).json({ error: "Cannot get page" });
  }
};

// @route GET api/pages/storybooks/:id
// @desc  Get all pages by a storybook id
// @access private
const getPagesByStoryBookId = async (req, res, next) => {
  try {
    const access = await Access.findOne({
      where: {
        googleId: req.userId,
        storyBookId: req.params.id,
      },
    });

    if (!access || access.length === 0) {
      const storyBook = await StoryBook.findByPk(req.params.id);
      if (!storyBook.public) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    const pages = await Page.findAll({
      where: { StoryBookId: req.params.id },
      order: [["position", "ASC"]],
    });
    if (!pages) {
      return res.status(404).json({ error: "Pages not found" });
    }
    res.status(200).json(pages);
  } catch (error) {
    return res.status(400).json({ error: "Cannot get pages" });
  }
};

// @route PATCH api/pages/:id
// @desc  Update a page by id
// @access private
const updatePage = async (req, res, next) => {
  try {
    const { paragraph } = req.body;
    if (!paragraph || typeof paragraph !== "string" || paragraph.length === 0) {
      return res.status(422).json({
        error:
          "Invalid input parameters. Expected paragraph to be a string with length > 0",
      });
    }

    const page = await Page.findByPk(req.params.id);
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    const access = await Access.findOne({
      where: {
        googleId: req.userId,
        storyBookId: page.StoryBookId,
      },
    });
    if (!access || access.length === 0) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await page.update({
      paragraph: paragraph,
    });
    await page.reload();

    const storyBook = await StoryBook.findByPk(page.StoryBookId);
    if (storyBook) {
      storyBook.changed("updatedAt", true);
      await storyBook.save();
    }
    res.status(200).json(page);
  } catch (error) {
    return res.status(400).json({ error: "Cannot update page" });
  }
};

// @route PATCH api/pages/storybooks/:id/order
// @desc Update the order of pages in a storybook
// @access private
const updatePageOrder = async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const { pages } = req.body;

    // Check if the user has access to this storybook
    const access = await Access.findOne({
      where: {
        googleId: req.userId,
        storyBookId: id,
      },
    });

    if (!access || access.length === 0) {
      await transaction.rollback();
      return res.status(403).json({ error: "Forbidden" });
    }

    // Update the position of each page
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      await Page.update(
        { position: i + 1 },
        {
          where: { id: page.id, StoryBookId: id },
          transaction
        }
      );
    }

    // Update the storybook's updatedAt timestamp
    const storyBook = await StoryBook.findByPk(id);
    if (storyBook) {
      storyBook.changed("updatedAt", true);
      await storyBook.save({ transaction });
    }

    await transaction.commit();
    res.status(200).json({ message: "Page order updated successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating page order:", error);
    return res.status(400).json({ error: "Cannot update page order" });
  }
};

export {
  createPage,
  deletePage,
  getPageById,
  getPagesByStoryBookId,
  updatePage,
  addPage,
  updatePageOrder
};
