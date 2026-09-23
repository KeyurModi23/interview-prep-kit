import express from 'express';
import { generate } from '../controllers/kitController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// For testing purposes, we'll leave this unprotected so we can test easily from the frontend first.
// Once we integrate auth on the frontend, we will add the 'protect' middleware back.
router.post('/generate', generate);

export default router;
