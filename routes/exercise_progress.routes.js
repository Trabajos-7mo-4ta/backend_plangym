import { Router } from 'express';
import {
  getExerciseProgressByUser,
  createExerciseProgress,
  deleteExerciseProgress
} from '../controllers/exercise_progress.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/:usuario_id', verifyToken, getExerciseProgressByUser);
router.post('/', verifyToken, createExerciseProgress);
router.delete('/:id', verifyToken, deleteExerciseProgress);

export default router;
