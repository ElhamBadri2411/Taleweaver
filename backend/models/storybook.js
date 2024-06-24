import { DataTypes } from "sequelize";
import db from "../utils/db.js"
import { User } from "./user.js";
import { Page } from "./page.js";


export const StoryBook = db.define("StoryBook", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

// Add back later, when user is implemented
// User.hasMany(StoryBook, { onDelete: 'CASCADE', hooks: true });
// StoryBook.belongsTo(User);

StoryBook.hasMany(Page, { onDelete: 'CASCADE', hooks: true });
Page.belongsTo(StoryBook);