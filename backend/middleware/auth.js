import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        let token = authHeader.split(' ');

        if (token.length !== 2 || token[0] !== "Bearer") {
            return res.sendStatus(401);
        }

        token = token[1];

        if (token === "null" || token === "undefined") {
            return res.sendStatus(401);
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, userId) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            req.userId = userId.userId;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};