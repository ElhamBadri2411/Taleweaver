import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import { generateImage } from "../controllers/images_controller.js";

const router = Router();

router.post("/", verifyToken, generateImage);

export default router;
