import { Router } from 'express';
import { getAllUsers, deleteUser, updateUserRole } from '../controllers/users.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, getAllUsers);
router.delete('/:id', verifyToken, deleteUser);
router.put('/:id/rol', verifyToken, updateUserRole);

export default router;