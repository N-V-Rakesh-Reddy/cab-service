import { supabaseAdmin } from '../config/supabase';
import { logger } from '../utils/logger';
import { User, UserInsert, UserUpdate, Booking } from '../models';

export class UserService {
  static async getUserProfileWithClient(userId: string, client: any): Promise<User | null> {
    try {
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Error fetching user profile:', error);
        return null;
      }

      return data as User;
    } catch (error) {
      logger.error('Error in getUserProfileWithClient:', { error: String(error) });
      return null;
    }
  }

  static async updateUserProfileWithClient(userId: string, userData: UserUpdate, client: any): Promise<User | null> {
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
        logger.error('Error updating user profile:', error);
        return null;
      }

      return data as User;
    } catch (error) {
      logger.error('Error in updateUserProfileWithClient:', { error: String(error) });
      return null;
    }
  }

  static async getUserBookingsWithClient(userId: string, client: any): Promise<Booking[]> {
    try {
      const { data, error } = await client
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching user bookings:', error);
        return [];
      }

      return data as Booking[];
    } catch (error) {
      logger.error('Error in getUserBookingsWithClient:', { error: String(error) });
      return [];
    }
  }

  static async findOrCreateUser(phone: string): Promise<User> {
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
        logger.error('Error creating user:', createError);
        throw createError;
      }

      return newUser as User;
    } catch (error) {
      logger.error('Error in findOrCreateUser:', { error: String(error) });
      throw error;
    }
  }
}
