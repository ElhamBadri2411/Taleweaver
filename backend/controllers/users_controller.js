import { User } from "../models/user.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// @route POST api/users/
// @desc  Create a new user
// @access public
const createUser = async (req, res, next) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(422).json({ error: "Missing id_token" });
    }
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    let user = await User.findOne({ where: { googleId: userid } });
    if (!user) {
      user = await User.create({
        googleId: userid,
        displayName: payload['name'],
        email: payload['email'],
      });
    }

    const token = jwt.sign({ userId: user.googleId }, process.env.JWT_SECRET, {});
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Cannot create user" });
  } 
};

// @route GET api/users/:id
// @desc  Get a user by id
// @access private
const getUserById = async (req, res, next) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await User.findByPk(req.params.id, { attributes: ["googleId", "displayName"] });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: "Cannot get user" });
  }
}

export {
  createUser,
  getUserById,
}
