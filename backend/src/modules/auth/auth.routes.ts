import { Router } from 'express';
import { sendOtpHandler, verifyOtpHandler } from './auth.controller';

const router = Router();

router.post('/send-otp', sendOtpHandler);
router.post('/verify-otp', verifyOtpHandler);

export default router;
