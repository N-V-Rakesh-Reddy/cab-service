import { supabaseAdmin, supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { User, UserInsert, UserUpdate, Booking } from '../models';

type SupabaseClient = typeof supabase | typeof supabaseAdmin;

export class UserService {
  static async getUserProfileWithClient(userId: string, client: SupabaseClient): Promise<User | null> {
    if (!userId) {
      logger.error('getUserProfileWithClient: userId is required');
      return null;
    }

    try {
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Error fetching user profile:', { error, userId });
        return null;
      }

      return data as User;
    } catch (error) {
      logger.error('Error in getUserProfileWithClient:', { 
        error: error instanceof Error ? error.message : String(error), 
        userId 
      });
      return null;
    }
  }

  static async updateUserProfileWithClient(userId: string, userData: UserUpdate, client: SupabaseClient): Promise<User | null> {
    if (!userId) {
      logger.error('updateUserProfileWithClient: userId is required');
      return null;
    }

    if (!userData || Object.keys(userData).length === 0) {
      logger.error('updateUserProfileWithClient: userData is required and cannot be empty');
      return null;
    }

    try {
      const updateData: UserUpdate = {
        ...userData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await client
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Error updating user profile:', { error, userId, updateData });
        return null;
      }

      return data as User;
    } catch (error) {
      logger.error('Error in updateUserProfileWithClient:', { 
        error: error instanceof Error ? error.message : String(error), 
        userId 
      });
      return null;
    }
  }

  static async getUserBookingsWithClient(userId: string, client: SupabaseClient): Promise<Booking[]> {
    if (!userId) {
      logger.error('getUserBookingsWithClient: userId is required');
      return [];
    }

    try {
      const { data, error } = await client
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching user bookings:', { error, userId });
        return [];
      }

      return data as Booking[];
    } catch (error) {
      logger.error('Error in getUserBookingsWithClient:', { 
        error: error instanceof Error ? error.message : String(error), 
        userId 
      });
      return [];
    }
  }

  static async findOrCreateUser(phone: string): Promise<User> {
    if (!phone) {
      const error = new Error('findOrCreateUser: phone number is required');
      logger.error(error.message);
      throw error;
    }

    try {
      // First try to find existing user
      const { data: existingUser, error: findError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('mobile_number', phone)
        .single();

      if (existingUser && !findError) {
        return existingUser as User;
      }

      // If user doesn't exist, create new one
      const userInsert: UserInsert = { 
        mobile_number: phone,
        is_verified: false
      };

      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert(userInsert)
        .select()
        .single();

      if (createError) {
        logger.error('Error creating user:', { error: createError, phone });
        throw createError;
      }

      if (!newUser) {
        const error = new Error('Failed to create user: no data returned');
        logger.error(error.message, { phone });
        throw error;
      }

      return newUser as User;
    } catch (error) {
      logger.error('Error in findOrCreateUser:', { 
        error: error instanceof Error ? error.message : String(error), 
        phone 
      });
      throw error;
    }
  }
}
