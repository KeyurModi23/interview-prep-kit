import express from 'express';
import { register, getAllUsers } from '../controllers/userController.js';
import { validateRegister } from '../validators/userValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.get('/', protect, getAllUsers);

export default router;
