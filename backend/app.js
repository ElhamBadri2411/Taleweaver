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
import { WebSocketServer } from 'ws'
import http from 'http'
import { setupWSConnection } from 'y-websocket/bin/utils'
import * as Y from 'yjs'



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
const wss = new WebSocketServer({ server })

const docs = new Map()

wss.on('connection', (conn, request) => {
  console.log("WebSocket connection established");
  const url = new URL(request.url, `http://${request.headers.host}`);
  const roomName = url.searchParams.get('room') || 'default-room';

  console.log(`Client connected to room: ${roomName}`);

  let doc = docs.get(roomName);

  if (!doc) {
    doc = new Y.Doc();
    docs.set(roomName, doc);
  }

  setupWSConnection(conn, request, { docName: roomName, doc: doc });

  conn.on("open", () => {
    console.log(`Client connected to room: ${roomName}`)
  })

  conn.on('close', () => {
    console.log(`Client disconnected from room: ${roomName}`);
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  else {
    console.log("HTTP server on http://localhost:%s", PORT);
  }
});
