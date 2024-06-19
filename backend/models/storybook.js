import { DataTypes } from "sequelize";
import db from "../utils/db.js"
import { User } from "./user.js";
import { Story } from "./story.js";


export const StoryBook = db.define("StoryBook", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

// Add back later, when user is implemented
// User.hasMany(StoryBook, { onDelete: 'CASCADE', hooks: true });
// StoryBook.belongsTo(User);

StoryBook.hasMany(Story, { onDelete: 'CASCADE', hooks: true });
Story.belongsTo(StoryBook);