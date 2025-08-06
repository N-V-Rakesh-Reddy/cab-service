import { Request, Response } from 'express';
import { supabaseAdmin } from '../../config/supabase';
import jwt from 'jsonwebtoken';

// Middleware to extract user from JWT token
const getUserFromToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return decoded.id;
  } catch (error) {
    return null;
  }
};

export class UserController {
  // Get user profile
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = getUserFromToken(req);
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, mobile_number, full_name, email, is_verified, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = getUserFromToken(req);
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { full_name, email } = req.body;

      const { data: user, error } = await supabaseAdmin
        .from('users')
        .update({
          full_name,
          email,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, mobile_number, full_name, email, is_verified, created_at')
        .single();

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Failed to update profile',
          error: error.message
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update user profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get user's bookings
  static async getUserBookings(req: Request, res: Response) {
    try {
      const userId = getUserFromToken(req);
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { data: bookings, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Failed to fetch bookings',
          error: error.message
        });
      }

      return res.status(200).json({
        success: true,
        data: bookings,
        count: bookings.length
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user bookings',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
