import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { unifiedAuth } from '../middlewares/unifiedAuth';

const router = Router();
const authController = new AuthController();

// Public auth routes (no authentication required)
router.post('/send-otp', authController.sendOtp.bind(authController));
router.post('/verify-otp', authController.verifyOtp.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));

// Protected auth routes (require authentication)
router.post('/logout', unifiedAuth, authController.logout.bind(authController));

export default router;
