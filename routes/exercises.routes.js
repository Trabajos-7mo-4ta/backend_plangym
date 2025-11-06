import { Router } from 'express';
import { getExercisesByDay, createExercise, updateExercise, deleteExercise } from '../controllers/exercises.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:dia_id', verifyToken, getExercisesByDay);
router.post('/', verifyToken, createExercise);
router.put('/:id', verifyToken, updateExercise);
router.delete('/:id', verifyToken, deleteExercise);

export default router;