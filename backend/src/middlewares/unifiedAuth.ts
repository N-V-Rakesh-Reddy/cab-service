import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase, supabaseAdmin } from '../config/supabase';
import { logger } from '../utils/logger';

// Extend Request to include client and user info
declare global {
  namespace Express {
    interface Request {
      supabaseClient: typeof supabase | typeof supabaseAdmin;
      isAdmin: boolean;
      user?: {
        id: string;
        email?: string;
        phone?: string;
      };
    }
  }
}

/**
 * Unified authentication middleware that handles both admin and user authentication
 * - If Authorization header contains `Bearer <ADMIN_SECRET>`, use admin client
 * - If Authorization header contains `Bearer <JWT_TOKEN>`, use regular client and verify JWT
 * - Otherwise, use regular client with no authentication
 */
export const unifiedAuth = async (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string || Math.random().toString(36).substring(7);
  const authHeader = req.headers.authorization;

  try {
    // Default to regular client
    req.supabaseClient = supabase;
    req.isAdmin = false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // Check if it's the admin secret
      if (process.env.ADMIN_SECRET && token === process.env.ADMIN_SECRET) {
        logger.info('Unified Auth: Admin access granted', {
          requestId,
          method: req.method,
          url: req.url,
          userAgent: req.headers['user-agent'],
          ip: req.ip
        });

        req.supabaseClient = supabaseAdmin;
        req.isAdmin = true;
        return next();
      }

      // Otherwise, treat as JWT token
      try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          logger.error('Unified Auth: JWT_SECRET not configured', { requestId });
          return res.status(500).json({ error: 'Authentication configuration error' });
        }

        const decoded = jwt.verify(token, jwtSecret) as any;
        
        logger.info('Unified Auth: User authentication successful', {
          userId: decoded.userId,
          requestId,
          method: req.method,
          url: req.url,
          userAgent: req.headers['user-agent'],
          ip: req.ip
        });

        req.user = {
          id: decoded.id,
          email: decoded.email,
          phone: decoded.mobile
        };
        req.isAdmin = false;
        return next();

      } catch (jwtError) {
        logger.warn('Unified Auth: Invalid JWT token', {
          error: jwtError instanceof Error ? jwtError.message : 'Unknown error',
          requestId,
          method: req.method,
          url: req.url
        });

        return res.status(401).json({ error: 'Invalid authentication token' });
      }
    }

    // No authorization header - proceed with regular client
    logger.info('Unified Auth: No authentication provided, using regular client', {
      requestId,
      method: req.method,
      url: req.url
    });

    next();

  } catch (error) {
    logger.error('Unified Auth: Middleware error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      requestId,
      method: req.method,
      url: req.url
    });

    res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Middleware to require admin authentication
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAdmin) {
    logger.warn('Require Admin: Access denied - not admin', {
      requestId: req.headers['x-request-id'] as string,
      method: req.method,
      url: req.url,
      userId: req.user?.id
    });

    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

/**
 * Middleware to require user authentication (JWT)
 */
export const requireUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    logger.warn('Require User: Access denied - not authenticated', {
      requestId: req.headers['x-request-id'] as string,
      method: req.method,
      url: req.url
    });

    return res.status(401).json({ error: 'User authentication required' });
  }
  next();
};
