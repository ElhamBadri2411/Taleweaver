import { User } from "../models/user.js";

// @route POST api/users/
// @desc  Create a new user
// @access public
const createUser = async (req, res, next) => {
  try {
    const { googleId, email, displayName, photoUrl } = req.body;
    if (!googleId || typeof googleId !== "string" || googleId.length === 0) {
      return res.status(422).json({
        error: "Invalid input parameters. Expected googleId to be a string with length > 0",
      });
    }
    if (!email || typeof email !== "string" || email.length === 0 || !email.includes("@")) {
      return res.status(422).json({
        error: "Invalid input parameters. Expected email to be a valid email string",
      });
    }
    if (!displayName || typeof displayName !== "string" || displayName.length === 0) {
      return res.status(422).json({
        error: "Invalid input parameters. Expected displayName to be a string with length > 0",
      });
    }
    
    const user = await User.create({ googleId, email, displayName, photoUrl });
    res.status(201).json(user);
  } catch (error) {
    return res.status(400).json({ error: "Cannot create user" });
  }
}

// @route GET api/users/:id
// @desc  Get a user by id
// @access private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: "Cannot get user" });
  }
}

// @route GET api/users/
// @desc  Get all users
// @access private
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ error: "Cannot get users" });
  }
}

// @route PATCH api/users/:id
// @desc  Update user details
// @access private
const updateUser = async (req, res, next) => {
  try {
    const { displayName, photoUrl } = req.body;
    if (displayName && (typeof displayName !== "string" || displayName.length === 0)) {
      return res.status(422).json({
        error: "Invalid input parameters. Expected displayName to be a string with length > 0",
      });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (displayName) user.displayName = displayName;
    if (photoUrl) user.photoUrl = photoUrl;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: "Cannot update user" });
  }
}

// @route DELETE api/users/:id
// @desc  Delete a user
// @access private
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(204).json();
  } catch (error) {
    return res.status(400).json({ error: "Cannot delete user" });
  }
}

export {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser
}
