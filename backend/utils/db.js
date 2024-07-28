import { configDotenv } from "dotenv";
import { Sequelize } from "sequelize";

configDotenv();

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
  },
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully.",
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;
