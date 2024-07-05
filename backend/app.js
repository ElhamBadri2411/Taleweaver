import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/users_router.js"
import storybookRouter from "./routes/storybooks_router.js";
import pageRouter from "./routes/page_router.js";
import db from "./utils/db.js";
import { configDotenv } from "dotenv";
import imageRoutes from "./routes/images_router.js"
import cors from "cors"
import path from 'path'
import { fileURLToPath } from "url";

// socket/real time collab imports
import ws from 'ws'
import http from 'http'
import * as Y from 'yjs'
import { WebsocketProvider } from "y-websocket";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express()
configDotenv()

const corsoptions = {
  origin: "http://localhost:4200",
  credentials: true
};

app.use(cors(corsoptions));

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
console.log(path.join(__dirname, 'generated-images'))

app.use('/api/generated-images', express.static(path.join(__dirname, 'generated-images')));

// routes
app.use("/api/images", imageRoutes)
app.use("/api/storybooks", storybookRouter)
app.use("/api/pages", pageRouter)
app.use("/api/users", userRoutes)


const server = http.createServer(app)

const doc = new Y.Doc()
const wsProvider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', doc, { WebSocketPolyfill: ws })

wsProvider.on('connection', (ws) => {
  console.log(ws)
})

server.listen(PORT, (err) => {
  if (err) console.log(err);
  else {
    console.log("HTTP server on http://localhost:%s", PORT);
    console.log('Websocket server running on ws://localhost:1234')
  }
});
