import { StoryBook } from "../models/storybook.js";
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
    const storyBook = await StoryBook.findByPk(req.params.id, {
      include: User.googleId,
    });
    if (!storyBook) {
      return res.status(404).json({ error: "StoryBook not found" });
    }

    if (req.userId !== storyBook.UserGoogleId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    res.status(200).json(storyBook);
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

    console.log("\n ----filter:", filter);

    if (!req.params.id) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const offset = (page - 1) * limit;

    const books = await StoryBook.findAndCountAll({
      where: {
        UserGoogleId: req.params.id,
        title: {
          [Op.like]: `%${filter}%`,
        },
      },
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    if (books.count === 0) {
      return res.status(404).json({ error: "Books not found" });
    }

    const pageOfBook = Math.ceil(books.count / limit);

    res.status(200).json({
      pageOfBook: pageOfBook,
      books: books.rows,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
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
  renameStoryBook,
  deleteStoryBook,
  generateStoryBook,
  getGenerationStatus,
};
