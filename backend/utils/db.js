import { configDotenv } from "dotenv";
import { Sequelize } from "sequelize";

configDotenv()

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  }
)

export default sequelize
