import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    mobile: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const requestContext = logger.getRequestContext(req);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Authentication failed: Missing or invalid auth header', requestContext);
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = {
      id: decoded.id,
      mobile: decoded.mobile
    };
    
    logger.info('User authenticated successfully', { 
      ...requestContext, 
      userId: decoded.id 
    });
    
    next();
  } catch (error) {
    logger.warn('Authentication failed: Invalid token', { 
      ...requestContext, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continue without authentication
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = {
      id: decoded.id,
      mobile: decoded.mobile
    };
    
    logger.info('Optional authentication successful', { userId: decoded.id });
  } catch (error) {
    logger.debug('Optional authentication failed, continuing without auth', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
  
  next();
};
