import { Access } from "../models/access.js";
import { StoryBook } from "../models/storybook.js";
import { User } from "../models/user.js";
import { Op } from "sequelize";

const createAccess = async (req, res) => {
  const { googleId, storyBookId, role } = req.body;

  if (!googleId || !storyBookId || !role) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  const book = await StoryBook.findByPk(storyBookId, {
    include: User.googleId,
  });
  if (!book) {
    return res.status(404).json({ error: "StoryBook not found" });
  }

  if (book.UserGoogleId !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const access = await Access.create({
      googleId,
      storyBookId,
      role,
    });
    res.status(201).json(access);
  } catch (error) {
    res.status(400).json({ error: "Cannot create access" });
  }
};

const removeAccess = async (req, res) => {
  const googleId = req.query.googleId;
  const storyBookId = req.query.storyBookId;

  if (!googleId || !storyBookId) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  const book = await StoryBook.findByPk(storyBookId, {
    include: User.googleId,
  });
  if (!book) {
    return res.status(404).json({ error: "StoryBook not found" });
  }

  if (book.UserGoogleId !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    await Access.destroy({
      where: {
        googleId,
        storyBookId,
      },
    });
    res.status(200).json({ message: "Access removed" });
  } catch (error) {
    res.status(400).json({ error: "Cannot remove access" });
  }
};

const getAccessByBookId = async (req, res) => {
  const storyBookId = parseInt(req.params.id);

  if (!storyBookId) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  const book = await StoryBook.findByPk(storyBookId, {
    include: User.googleId,
  });
  if (!book) {
    return res.status(404).json({ error: "StoryBook not found" });
  }

  if (book.UserGoogleId !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const access = await Access.findAll({
      where: {
        storyBookId,
        googleId: {
          [Op.ne]: req.userId,
        },
      },
    });
    const users = await User.findAll({
      where: {
        googleId: {
          [Op.in]: access.map((a) => a.googleId),
        },
      },
      attributes: ["email"],
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Cannot get access" });
  }
};

export { createAccess, removeAccess, getAccessByBookId };
