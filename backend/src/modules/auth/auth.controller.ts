import { Request, Response } from 'express';
import { sendOtp } from '../../services/otpService';
import { completeOtpLogin } from './auth.service';

export const sendOtpHandler = async (req: Request, res: Response) => {
  const { mobile } = req.body;

  if (!mobile) {
    return res.status(400).json({ error: 'Mobile number is required' });
  }

  try {
    const otpResponse = await sendOtp(mobile);
    res.status(200).json({ message: 'OTP sent', sessionId: otpResponse.Details });
  } catch (error: any) {
    console.error('[Send OTP Error]', error.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyOtpHandler = async (req: Request, res: Response) => {
  const { mobile, otp, sessionId } = req.body;

  if (!mobile || !otp || !sessionId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { token, user } = await completeOtpLogin(mobile, otp, sessionId);
    res.status(200).json({ token, user });
  } catch (error: any) {
    console.error('[Verify OTP Error]', error.message);
    res.status(401).json({ error: 'OTP verification failed' });
  }
};