import { verifyOtp } from '../../services/otpService';
import { findOrCreateUser } from '../user/user.service';
import { signToken } from '../../utils/jwt';

export const completeOtpLogin = async (mobile: string, otp: string, sessionId: string) => {
  const result = await verifyOtp(sessionId, otp);

  if (result.Status !== 'Success') {
    throw new Error('Invalid OTP');
  }

  const user = await findOrCreateUser(mobile);
  const token = signToken({ id: user.id, mobile: user.mobile });

  return { token, user };
};
