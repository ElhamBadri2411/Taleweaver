import { DataTypes } from "sequelize";
import db from "../utils/db.js";
import { StoryBook } from "./storybook.js";

// Define the User model
export const User = db.define("User", {
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Define associations
User.hasMany(StoryBook, { onDelete: 'CASCADE', hooks: true });
StoryBook.belongsTo(User);

export default User;
