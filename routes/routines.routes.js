// routes/routines.routes.js
import { Router } from 'express';
import {
  getPublicRoutines,
  getRoutinesByUser,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  setRoutineAsCurrent,
  getCurrentRoutine,
  getRoutineDetails,
  copyRoutine
} from '../controllers/routines.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/public', getPublicRoutines);
router.get('/user/:id', verifyToken, getRoutinesByUser);
router.get('/actual/:id', verifyToken, getCurrentRoutine); // obtener rutina actual por usuario
router.get('/:id/details', verifyToken, getRoutineDetails); // detalles de la rutina
router.post('/', verifyToken, createRoutine);
router.put('/:id', verifyToken, updateRoutine);
router.put('/:id/actual', verifyToken, setRoutineAsCurrent); // marcar como actual
router.delete('/:id', verifyToken, deleteRoutine);
router.post('/:id/copiar', verifyToken, copyRoutine);


export default router;