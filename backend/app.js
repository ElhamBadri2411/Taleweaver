import express from "express";
import bodyParser from "body-parser";

export const app = express()

app.use(bodyParser.json())


const PORT = 3000;

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
