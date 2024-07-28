import { DataTypes } from "sequelize";
import db from "../utils/db.js";
import { User } from "./user.js";
import { Page } from "./page.js";

export const StoryBook = db.define("StoryBook", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isGenerating: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

StoryBook.hasMany(Page, { onDelete: "CASCADE", hooks: true });
Page.belongsTo(StoryBook);
