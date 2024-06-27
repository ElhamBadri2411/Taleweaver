import express from 'express';

import { createUser, 
  getUserById, 
  getUsers, 
  updateUser, 
  deleteUser 
} from '../controllers/users_controller.js';

const router = express.Router();

router.post('/', createUser);
router.get('/:id', getUserById);
router.get('/', getUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

