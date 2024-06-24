import { Router } from "express";

import {
  generateImage
} from "../controllers/images_controller.js"

const router = Router()

router.post("/", generateImage)

export default router
