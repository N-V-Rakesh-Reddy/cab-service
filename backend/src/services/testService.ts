import { supabaseAdmin } from '../config/supabase';

export interface TestItem {
  id?: string;
  name: string;
  description?: string;
  value?: number;
  is_active?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export class TestService {
  // Create a new test item
  static async createTestItem(data: Omit<TestItem, 'id' | 'created_at' | 'updated_at'>): Promise<TestItem> {
    const { data: result, error } = await supabaseAdmin
      .from('test_items')
      .insert([{
        ...data,
        updated_at: new Date().toISOString()
      }])
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create test item: ${error.message}`);
    }

    return result;
  }

  // Get all test items
  static async getAllTestItems(): Promise<TestItem[]> {
    const { data, error } = await supabaseAdmin
      .from('test_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch test items: ${error.message}`);
    }

    return data || [];
  }

  // Get test item by ID
  static async getTestItemById(id: string): Promise<TestItem | null> {
    const { data, error } = await supabaseAdmin
      .from('test_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw new Error(`Failed to fetch test item: ${error.message}`);
    }

    return data;
  }

  // Update test item
  static async updateTestItem(id: string, data: Partial<Omit<TestItem, 'id' | 'created_at'>>): Promise<TestItem> {
    const { data: result, error } = await supabaseAdmin
      .from('test_items')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update test item: ${error.message}`);
    }

    return result;
  }

  // Delete test item
  static async deleteTestItem(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('test_items')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete test item: ${error.message}`);
    }

    return true;
  }

  // Get test items by user ID (for user-specific operations)
  static async getTestItemsByUserId(userId: string): Promise<TestItem[]> {
    const { data, error } = await supabaseAdmin
      .from('test_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user test items: ${error.message}`);
    }

    return data || [];
  }

  // Test database connection
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('test_items')
        .select('count')
        .limit(1);

      if (error) {
        return { success: false, message: `Database connection failed: ${error.message}` };
      }

      return { success: true, message: 'Database connection successful' };
    } catch (err) {
      return { success: false, message: `Database connection error: ${err}` };
    }
  }
}
