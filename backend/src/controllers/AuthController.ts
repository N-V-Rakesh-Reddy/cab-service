import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AuthService } from '../services/authService';

export class AuthController extends BaseController {
  /**
   * POST /auth/send-otp
   * Send OTP for authentication - public endpoint
   */
  async sendOtp(req: Request, res: Response): Promise<void> {
    const requestId = this.getRequestId(req);
    const { mobile } = req.body;

    this.logRequestStart(req, requestId, 'Auth Send OTP', {
      mobile: mobile?.substring(0, 3) + '****'
    });

    try {
      // Validate required fields
      const validation = this.validateRequiredFields(req.body, ['mobile']);
      if (!validation.valid) {
        return this.sendError(res, `Missing required fields: ${validation.missing.join(', ')}`, requestId, 400);
      }

      const result = await AuthService.sendOtpToUser(mobile);

      this.logSuccess(requestId, 'Auth Send OTP', {
        mobile: mobile.substring(0, 3) + '****',
        sessionId: result.sessionId
      });

      this.sendSuccess(res, result, requestId, false);

    } catch (error) {
      this.handleError(error, res, requestId, 'Auth Send OTP');
    }
  }

  /**
   * POST /auth/verify-otp
   * Verify OTP and authenticate - public endpoint
   */
  async verifyOtp(req: Request, res: Response): Promise<void> {
    const requestId = this.getRequestId(req);
    const { mobile, otp, sessionId } = req.body;

    this.logRequestStart(req, requestId, 'Auth Verify OTP', {
      mobile: mobile?.substring(0, 3) + '****',
      sessionId
    });

    try {
      // Validate required fields
      const validation = this.validateRequiredFields(req.body, ['mobile', 'otp', 'sessionId']);
      if (!validation.valid) {
        return this.sendError(res, `Missing required fields: ${validation.missing.join(', ')}`, requestId, 400);
      }

      const result = await AuthService.verifyOtpAndLogin(mobile, otp, sessionId);

      this.logSuccess(requestId, 'Auth Verify OTP', {
        mobile: mobile.substring(0, 3) + '****',
        userId: result.user.id
      });

      this.sendSuccess(res, result, requestId, false);

    } catch (error) {
      this.handleError(error, res, requestId, 'Auth Verify OTP');
    }
  }

  /**
   * POST /auth/refresh-token
   * Refresh authentication token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    const requestId = this.getRequestId(req);
    const { userId } = req.body;

    this.logRequestStart(req, requestId, 'Auth Refresh Token', { userId });

    try {
      // Validate required fields
      const validation = this.validateRequiredFields(req.body, ['userId']);
      if (!validation.valid) {
        return this.sendError(res, `Missing required fields: ${validation.missing.join(', ')}`, requestId, 400);
      }

      // Only allow users to refresh their own token (unless admin)
      if (!this.canAccessResource(req, userId)) {
        return this.handleAccessDenied(req, res, requestId, userId, 'Auth Refresh Token');
      }

      const result = await AuthService.refreshUserToken(userId);

      this.logSuccess(requestId, 'Auth Refresh Token', { userId });

      this.sendSuccess(res, result, requestId, req.isAdmin);

    } catch (error) {
      this.handleError(error, res, requestId, 'Auth Refresh Token');
    }
  }
}
