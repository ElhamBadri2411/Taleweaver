import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USERNAME,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
  }
)

export default sequelize
