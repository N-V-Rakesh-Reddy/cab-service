import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

// Auth routes (no /auth prefix needed since it's added in main routes)
router.post('/send-otp', authController.sendOtp.bind(authController));
router.post('/verify-otp', authController.verifyOtp.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));

export default router;
