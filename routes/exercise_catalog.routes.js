import { Router } from 'express';
import {
  getAllExercises,
  createExercise,
  deleteExercise,
  updateExercise
} from '../controllers/exercise_catalog.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, getAllExercises);
router.post('/', verifyToken, createExercise);
router.delete('/:id', verifyToken, deleteExercise);
router.put('/:id', verifyToken, updateExercise);


export default router;