import { Router } from 'express';
import { registerUser, loginUser, loginWithGoogle  } from '../controllers/auth.controller.js';


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/auth/google', loginWithGoogle);



export default router;
