import { Router } from 'express';
import { getDaysByRoutine, createDay, updateDay, deleteDay } from '../controllers/days.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:rutina_id', verifyToken, getDaysByRoutine);
router.post('/', verifyToken, createDay);
router.put('/:id', verifyToken, updateDay);
router.delete('/:id', verifyToken, deleteDay);

export default router;