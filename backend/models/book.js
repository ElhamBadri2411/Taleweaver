import { DataTypes } from "sequelize";
import db from "../utils/db.js"


export const Book = db.define("Book", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
})


