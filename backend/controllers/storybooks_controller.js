import { StoryBook } from "../models/storybook.js";
import { Access } from "../models/access.js";
import { User } from "../models/user.js";
import { storyQueue } from "../bullmq.js";
import { Op } from "sequelize";

// Add authentication later

// @route POST api/storybooks/
// @desc  Create a new storybook
// @access private
const createStoryBook = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!title || typeof title !== "string" || title.length === 0) {
      return res.status(422).json({
        error:
          "Invalid input parameters. Expected title to be a string with length > 0",
      });
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.length === 0
    ) {
      return res.status(422).json({
        error:
          "Invalid input parameters. Expected title to be a description with length > 0",
      });
    }
    const storyBook = await StoryBook.create({
      title,
      description,
      UserGoogleId: user.googleId,
    });
    await Access.create({
      googleId: user.googleId,
      storyBookId: storyBook.id,
      role: "owner",
    });
    res.status(201).json(storyBook);
  } catch (error) {
    return res.status(400).json({ error: "Cannot create storyBook" });
  }
};

// @route GET api/storybooks/:id
// @desc  Get a storybook by id
// @access private
const getStoryBookById = async (req, res, next) => {
  try {
    // Get the storybook
    const storyBook = await StoryBook.findByPk(req.params.id, {
      include: User.googleId,
    });
    
    if (!storyBook) {
      return res.status(404).json({ error: "StoryBook not found" });
    }

    // Check if the user has access to the book
    const access = await Access.findOne({
      where: {
        googleId: req.userId,
        storyBookId: req.params.id,
      },
    });

    if (!access) {
      //Check if the book is public
      if (storyBook.public) {
        return res.status(200).json({ storyBook, access: "read" });
      }
      return res.status(403).json({ error: "Forbidden" });
    }

    res.status(200).json({ storyBook, access: access.role, public: storyBook.public });
  } catch (error) {
    return res.status(400).json({ error: "Cannot get storyBook" });
  }
};

// @route GET api/storybooks/users/:id
// @desc  Get all storybook by a user
// @access private
const getStoryBooks = async (req, res, next) => {
  try {
    const filter = req.query.filter || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!req.params.id) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const offset = (page - 1) * limit;

    const bookIds = await Access.findAll({
      where: {
        googleId: req.params.id,
      },
      params: ["storyBookId"],
    });

    if (!bookIds) {
      return res.status(404).json({ error: "Books not found" });
    }

    const books = await StoryBook.findAndCountAll({
      where: {
        id: {
          [Op.in]: bookIds.map((book) => book.storyBookId),
        },
        title: {
          [Op.like]: `%${filter}%`,
        },
      },
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    if (!books) {
      return res.status(404).json({ error: "Books not found" });
    }

    const pageOfBook = Math.ceil(books.count / limit);

    res.status(200).json({
      pageOfBook: pageOfBook,
      books: books.rows,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// @route GET api/storybooks/public/
// @desc Get all public storybooks
// @access private
const getPublicStoryBooks = async (req, res, next) => {
  try {
    const filter = req.query.filter || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    const books = await StoryBook.findAndCountAll({
      where: {
        public: true,
        title: {
          [Op.like]: `%${filter}%`,
        },
      },
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    if (!books) {
      return res.status(404).json({ error: "Books not found" });
    }

    const pageOfBook = Math.ceil(books.count / limit);
    res.status(200).json({
      pageOfBook: pageOfBook,
      books: books.rows,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// @route PATCH api/storybooks/public/:id
// @desc  Change the public status of a storybook
// @access private
const changeStoryBookPublicStatus = async (req, res, next) => {
  try {
    const access = await Access.findOne({
      where: {
        googleId: req.userId,
        storyBookId: req.params.id,
      },
    });

    if (!access || access.role !== "owner") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const storyBook = await StoryBook.findByPk(req.params.id);
    if (!storyBook) {
      return res.status(404).json({ error: "StoryBook not found" });
    }
    await storyBook.update({
      public: !storyBook.public,
    });
    await storyBook.reload();
    res.status(200).json(storyBook);
  } catch (error) {
    return res.status(400).json({ error: "Cannot change storyBook status" });
  }
};

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
    const storyBook = await StoryBook.findByPk(req.params.id, {
      include: User.googleId,
    });
    if (!storyBook) {
      return res.status(404).json({ error: "StoryBook not found" });
    }
    if (req.userId !== storyBook.UserGoogleId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await storyBook.update({
      title: title,
    });
    await storyBook.reload();
    res.status(200).json(storyBook);
  } catch (error) {
    return res.status(400).json({ error: "Cannot rename storyBook" });
  }
};

// @route DELETE api/storybooks/:id
// @desc  Delete a storybook
// @access private
const deleteStoryBook = async (req, res, next) => {
  try {
    const storyBook = await StoryBook.findByPk(req.params.id, {
      include: User.googleId,
    });
    if (!storyBook) {
      return res.status(404).json({ error: "StoryBook not found" });
    }
    if (req.userId !== storyBook.UserGoogleId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await storyBook.destroy();
    res.status(204).json();
  } catch (error) {
    return res.status(400).json({ error: "Cannot delete storyBook" });
  }
};

const generateStoryBook = async (req, res, next) => {
  const { title, description } = req.body;
  const userId = req.userId;
  try {
    const story = await StoryBook.create({
      title,
      description,
      UserGoogleId: userId,
      isGenerating: true,
    });
    await Access.create({
      googleId: userId,
      storyBookId: story.id,
      role: "owner",
    });
    const jobId = `job_${story.id}`;
    await storyQueue.add(
      "generateStory",
      { storyId: story.id, title, description },
      { jobId: jobId }
    );
    res
      .status(200)
      .json({ message: "Story creation initiated", storyId: story.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create story" + error });
  }
};

const getGenerationStatus = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;
  const jobId = `job_${id}`;
  try {
    const job = await storyQueue.getJob(jobId);
    if (job) {
      const state = await job.getState();
      res.status(200).json({ status: state, progress: job.progress });
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get job status" });
  }
};

export {
  createStoryBook,
  getStoryBookById,
  getStoryBooks,
  getPublicStoryBooks,
  changeStoryBookPublicStatus,
  renameStoryBook,
  deleteStoryBook,
  generateStoryBook,
  getGenerationStatus,
};
