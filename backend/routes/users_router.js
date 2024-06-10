import { Router } from "express";

import {
  createUser,
  getUser,
} from "../controllers/users_controller.js"

const router = Router()

router.post("/", createUser)
router.post("/:id", getUser)

export default router


