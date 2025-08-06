import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta: {
    requestId: string;
    timestamp: string;
    isAdmin?: boolean;
    [key: string]: any;
  };
}

export abstract class BaseController {
  /**
   * Static method for sending success responses
   */
  static sendSuccessResponse<T>(
    res: Response, 
    data: T, 
    message?: string,
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      data,
      message,
      meta: {
        requestId: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString()
      }
    });
  }
  /**
   * Generate request ID from headers or create new one
   */
  protected getRequestId(req: Request): string {
    return (req.headers['x-request-id'] as string) || Math.random().toString(36).substring(7);
  }

  /**
   * Check if user can access the resource (own data only for non-admin)
   */
  protected canAccessResource(req: Request, resourceUserId: string): boolean {
    if (req.isAdmin) {
      return true; // Admin can access anything
    }
    
    if (!req.user) {
      return false; // No authentication
    }
    
    return req.user.id === resourceUserId; // Can only access own data
  }

  /**
   * Send success response with consistent format
   */
  protected sendSuccess<T>(
    res: Response, 
    data: T, 
    requestId: string, 
    isAdmin: boolean = false,
    meta: Record<string, any> = {}
  ): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
        isAdmin,
        ...meta
      }
    };

    res.json(response);
  }

  /**
   * Send error response with consistent format
   */
  protected sendError(
    res: Response, 
    error: string, 
    requestId: string, 
    statusCode: number = 500
  ): void {
    const response: ApiResponse = {
      success: false,
      error,
      meta: {
        requestId,
        timestamp: new Date().toISOString()
      }
    };

    res.status(statusCode).json(response);
  }

  /**
   * Handle common error scenarios
   */
  protected handleError(
    error: unknown, 
    res: Response, 
    requestId: string, 
    context: string
  ): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    logger.error(`${context}: Error occurred`, {
      requestId,
      error: errorMessage
    });

    this.sendError(res, 'Internal server error', requestId, 500);
  }

  /**
   * Log and validate access denial
   */
  protected handleAccessDenied(
    req: Request, 
    res: Response, 
    requestId: string, 
    resourceId: string,
    context: string
  ): void {
    logger.warn(`${context}: Access denied`, {
      resourceId,
      requestId,
      authenticatedUserId: req.user?.id,
      isAdmin: req.isAdmin
    });

    this.sendError(res, 'Access denied', requestId, 403);
  }

  /**
   * Validate required fields in request body
   */
  protected validateRequiredFields(
    body: any, 
    requiredFields: string[]
  ): { valid: boolean; missing: string[] } {
    const missing = requiredFields.filter(field => !body || !body[field]);
    return {
      valid: missing.length === 0,
      missing
    };
  }

  /**
   * Log request start with common fields
   */
  protected logRequestStart(
    req: Request, 
    requestId: string, 
    context: string,
    additionalData: Record<string, any> = {}
  ): void {
    logger.info(`${context}: Request started`, {
      requestId,
      method: req.method,
      url: req.url,
      isAdmin: req.isAdmin,
      authenticatedUserId: req.user?.id,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      ...additionalData
    });
  }

  /**
   * Log successful operation
   */
  protected logSuccess(
    requestId: string, 
    context: string,
    additionalData: Record<string, any> = {}
  ): void {
    logger.info(`${context}: Operation successful`, {
      requestId,
      ...additionalData
    });
  }
}
