import express from 'express';
import { verifyToken } from '../middleware/auth.js';

import { 
  createUser, 
  getUserById,
} from '../controllers/users_controller.js';

const router = express.Router();

router.post('/', createUser);
router.get('/:id', verifyToken, getUserById);

export default router;

