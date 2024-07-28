import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
    createAccess, 
    removeAccess,
    getAccessByBookId
} from "../controllers/access_controller.js";

const router = Router();

router.post("/", verifyToken, createAccess);
router.delete("/", verifyToken, removeAccess);
router.get("/:id", verifyToken, getAccessByBookId);

export default router;