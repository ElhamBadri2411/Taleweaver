import { DataTypes } from "sequelize";
import db from "../utils/db.js"


export const Story = db.define("Story", {
    paragraph: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.JSON,
        allowNull: true //Nullable for now
    }
})


