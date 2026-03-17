import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js'; 

// Public routes
router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.requestPasswornReset);

// Protected routes
router.get('/me',authMiddleware, authController.getCurrentUser);

export default router;