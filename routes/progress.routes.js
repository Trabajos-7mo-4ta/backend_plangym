import { Router } from 'express';
import { getProgressByUser, createProgress, deleteProgress } from '../controllers/progress.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:usuario_id', verifyToken, getProgressByUser);
router.post('/', verifyToken, createProgress);
router.delete('/:id', verifyToken, deleteProgress);

export default router;