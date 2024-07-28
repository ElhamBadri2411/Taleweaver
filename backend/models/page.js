import { DataTypes } from "sequelize";
import db from "../utils/db.js";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

export const Page = db.define("Page", {
  paragraph: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Page.beforeDestroy((instance, options) => {
  if (instance.getDataValue("image").path) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const imagePath = path.join(
      __dirname,
      "..",
      instance.getDataValue("image").path,
    );
    console.log(imagePath);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    } else {
      console.error("image path doesnt exist");
    }
  }
  console.log("beforedestroy: not found");
});
