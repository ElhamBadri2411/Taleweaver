import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/users_router.js"
import booksRoutes from "./routes/books_router.js"
import db from "./utils/db.js";
import { configDotenv } from "dotenv";
import imageRoutes from "./routes/images_router.js"

export const app = express()
configDotenv()


try {
  await db.authenticate();
  // Automatically detect all of your defined models and create (or modify) the tables for you.
  // This is not recommended for production-use, but that is a topic for a later time!
  await db.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 3000;

// routes
app.use("/books", booksRoutes)
app.use("/users", userRoutes)
app.use("/api/images", imageRoutes)


app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
