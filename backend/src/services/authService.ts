import { verifyOtp, sendOtp } from './otpService';
import { UserService } from './userService';
import { signToken } from '../utils/jwt';
import { logger } from '../utils/logger';
import { supabaseAdmin } from '../config/supabase';
import { User, ApiResponse, SendOtpRequest, VerifyOtpRequest } from '../models';

export class AuthService {
  static async sendOtpToUser(mobile: string): Promise<{ sessionId: string; message: string }> {
    logger.info('Sending OTP to user', { mobile: mobile.substring(0, 3) + '****' });
    
    try {
      const otpResponse = await sendOtp(mobile);
      
      if (otpResponse.Status !== 'Success') {
        logger.error('OTP sending failed', { 
          mobile: mobile.substring(0, 3) + '****', 
          status: otpResponse.Status 
        });
        throw new Error('Failed to send OTP');
      }

      logger.info('OTP sent successfully', { 
        mobile: mobile.substring(0, 3) + '****', 
        sessionId: otpResponse.Details 
      });
      
      return {
        sessionId: otpResponse.Details,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      logger.error('Error in sendOtpToUser', { mobile: mobile.substring(0, 3) + '****' }, error);
      throw error;
    }
  }

  static async verifyOtpAndLogin(mobile: string, otp: string, sessionId: string): Promise<{
    token: string;
    user: any;
    message: string;
  }> {
    logger.info('Starting OTP verification and login', { 
      mobile: mobile.substring(0, 3) + '****', 
      sessionId 
    });
    
    try {
      // Verify OTP
      const otpResult = await verifyOtp(sessionId, otp);
      
      if (otpResult.Status !== 'Success') {
        logger.warn('OTP verification failed', { 
          mobile: mobile.substring(0, 3) + '****', 
          sessionId, 
          status: otpResult.Status 
        });
        throw new Error('Invalid OTP');
      }

      logger.info('OTP verified successfully', { 
        mobile: mobile.substring(0, 3) + '****', 
        sessionId 
      });

      // Find or create user
      const user = await UserService.findOrCreateUser(mobile);
      
      // Generate JWT token
      const token = signToken({ 
        id: user.id, 
        mobile: user.mobile_number 
      });

      logger.info('User authentication completed successfully', { 
        userId: user.id, 
        mobile: mobile.substring(0, 3) + '****' 
      });

      return {
        token,
        user: {
          id: user.id,
          mobile_number: user.mobile_number,
          full_name: user.full_name,
          email: user.email,
          is_verified: user.is_verified
        },
        message: 'Login successful'
      };
    } catch (error) {
      logger.error('Error in verifyOtpAndLogin', { 
        mobile: mobile.substring(0, 3) + '****', 
        sessionId 
      }, error);
      throw error;
    }
  }

  static async refreshUserToken(userId: string): Promise<{ token: string; user: any }> {
    logger.info('Refreshing user token', { userId });
    
    try {
      const user = await UserService.getUserProfileWithClient(userId, supabaseAdmin);
      
      if (!user) {
        logger.warn('User not found for token refresh', { userId });
        throw new Error('User not found');
      }

      const token = signToken({ 
        id: user.id, 
        mobile: user.mobile_number 
      });

      logger.info('Token refreshed successfully', { userId });

      return {
        token,
        user: {
          id: user.id,
          mobile_number: user.mobile_number,
          full_name: user.full_name,
          email: user.email,
          is_verified: user.is_verified
        }
      };
    } catch (error) {
      logger.error('Error refreshing user token', { userId }, error);
      throw error;
    }
  }
}
