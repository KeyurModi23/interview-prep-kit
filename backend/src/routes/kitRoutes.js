import express from 'express';
import { generate, getKits, saveKit, getKitById } from '../controllers/kitController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/generate', generate); // Anyone can generate
router.get('/', protect, getKits);
router.post('/', protect, saveKit);
router.get('/:id', protect, getKitById);
export default router;