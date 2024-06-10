import { User } from "../models/user.js";

// @route POST api/users/
// @desc  Create a new user
// @access public
const createUser = async (req, res, next) => {
  // TODO: Implement
  const { name } = req.body;

  const user = await User.create({
    name
  })

  res.status(201).json(user)
}

// @route GET api/users/:id
// @desc  Get a user by id
// @access private
const getUser = async (req, res, next) => {
  // TODO: Implement
}

export {
  createUser,
  getUser,
}
