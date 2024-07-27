import { DataTypes } from "sequelize";
import db from "../utils/db.js";
import { User } from "./user.js";
import { StoryBook } from "./storybook.js";

export const Access = db.define("Access", {
    googleId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    storyBookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Access.hasMany(User, { foreignKey: "googleId" });
Access.hasMany(StoryBook, { foreignKey: "storyBookId" });
    