import { DataTypes } from "sequelize";
import db from "../utils/db.js"


export const Page = db.define("Page", {
  paragraph: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.JSON,
    allowNull: true
  }
})
