import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    let token = authHeader.split(" ");

    if (token.length !== 2 || token[0] !== "Bearer") {
      return res.sendStatus(401);
    }

    token = token[1];

    if (token === "null" || token === "undefined") {
      return res.sendStatus(401);
    }

    const client = new OAuth2Client(process.env.CLIENT_ID);
    const ticket = client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    ticket
      .then((data) => {
        req.userId = data.getPayload()["sub"];
        next();
      })
      .catch((error) => {
        console.error(error);
        res.sendStatus(401);
      });
  } else {
    res.sendStatus(401);
  }
};
