import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  generateAudio,
  checkAudio,
  deleteAudio,
} from "../controllers/tts_controller.js"

const router = Router()

router.post("/", verifyToken, generateAudio);
router.get("/:bookId", verifyToken, checkAudio);
router.delete("/:bookId", verifyToken, deleteAudio);


export default router
