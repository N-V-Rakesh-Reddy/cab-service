import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { UserService } from '../services/userService';
import { User, UserUpdate, ApiResponse, PaginatedResponse, Booking } from '../models';

export class UserController extends BaseController {
  constructor() {
    super();
  }

  /**
   * Get user by ID
   */
  async getUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    const requestId = this.getRequestId(req);

    console.log(`Getting user ${userId}`, { requestId });

    try {
      // Validate access - users can only access their own data, admins can access any
      if (!req.isAdmin && req.user?.id !== userId) {
        return this.sendError(res, 'Access denied', requestId, 403);
      }

      const user = await UserService.getUserProfileWithClient(userId, req.supabaseClient);
      
      if (!user) {
        return this.sendError(res, 'User not found', requestId, 404);
      }

      this.sendSuccess(res, { user }, requestId);
    } catch (error) {
      console.error(`Failed to get user ${userId}:`, error, { requestId });
      this.sendError(res, 'Failed to get user', requestId, 500);
    }
  }

  /**
   * Update user by ID
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    const updates = req.body;
    const requestId = this.getRequestId(req);

    console.log(`Updating user ${userId}`, { requestId, updates });

    try {
      // Validate access - users can only update their own data, admins can update any
      if (!req.isAdmin && req.user?.id !== userId) {
        return this.sendError(res, 'Access denied', requestId, 403);
      }

      // Remove sensitive fields that shouldn't be updated directly
      const { id, created_at, updated_at, ...allowedUpdates } = updates;

      const updatedUser = await UserService.updateUserProfileWithClient(
        userId, 
        allowedUpdates, 
        req.supabaseClient
      );

      if (!updatedUser) {
        return this.sendError(res, 'User not found', requestId, 404);
      }

      this.sendSuccess(res, { user: updatedUser }, requestId);
    } catch (error) {
      console.error(`Failed to update user ${userId}:`, error, { requestId });
      this.sendError(res, 'Failed to update user', requestId, 500);
    }
  }

  /**
   * Get user bookings
   */
  async getUserBookings(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    const requestId = this.getRequestId(req);

    console.log(`Getting bookings for user ${userId}`, { requestId });

    try {
      // Validate access - users can only access their own bookings, admins can access any
      if (!req.isAdmin && req.user?.id !== userId) {
        return this.sendError(res, 'Access denied', requestId, 403);
      }

      const bookings = await UserService.getUserBookingsWithClient(userId, req.supabaseClient);

      this.sendSuccess(res, { bookings }, requestId);
    } catch (error) {
      console.error(`Failed to get bookings for user ${userId}:`, error, { requestId });
      this.sendError(res, 'Failed to get user bookings', requestId, 500);
    }
  }

  /**
   * List all users (admin only)
   */
  async listUsers(req: Request, res: Response): Promise<void> {
    const requestId = this.getRequestId(req);

    console.log('Listing all users', { requestId });

    try {
      // Only admins can list all users
      if (!req.isAdmin) {
        return this.sendError(res, 'Admin access required', requestId, 403);
      }

      const { page = 1, limit = 50 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      // For listing users, we'll need to use a custom query since UserService doesn't have a listUsers method
      const { data: users, error, count } = await req.supabaseClient
        .from('users')
        .select('*', { count: 'exact' })
        .range(offset, offset + Number(limit) - 1);

      if (error) {
        throw error;
      }

      this.sendSuccess(res, {
        users: users || [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0
        }
      }, requestId);
    } catch (error) {
      console.error('Failed to list users:', error, { requestId });
      this.sendError(res, 'Failed to list users', requestId, 500);
    }
  }
}