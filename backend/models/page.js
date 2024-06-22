import { DataTypes } from "sequelize";
import db from "../utils/db.js"


export const Page = db.define("Page", {
    paragraph: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.JSON,
        allowNull: true //Nullable for now
    }
})


