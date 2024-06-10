import { DataTypes } from "sequelize";
import db from "../utils/db.js"


export const User = db.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
})
