import express from 'express';
import { verifyToken } from '../middleware/auth.js';

import { 
  createUser, 
  getUserById,
  getAllUsers,
} from '../controllers/users_controller.js';

const router = express.Router();

router.post('/', createUser);
router.get('/:id', verifyToken, getUserById);
router.get('/', verifyToken, getAllUsers);

export default router;

