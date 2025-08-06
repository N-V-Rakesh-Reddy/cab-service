import { Request, Response } from 'express';
import { TestService, TestItem } from '../services/testService';

export class TestController {
  // Test database connection
  static async testConnection(req: Request, res: Response) {
    try {
      const result = await TestService.testConnection();
      
      return res.status(result.success ? 200 : 500).json({
        success: result.success,
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create a new test item
  static async createTestItem(req: Request, res: Response) {
    try {
      const { name, description, value, user_id } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Name is required'
        });
      }

      const testItem = await TestService.createTestItem({
        name,
        description,
        value: value || 0,
        user_id,
        is_active: true
      });

      return res.status(201).json({
        success: true,
        message: 'Test item created successfully',
        data: testItem
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create test item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all test items
  static async getAllTestItems(req: Request, res: Response) {
    try {
      const testItems = await TestService.getAllTestItems();

      return res.status(200).json({
        success: true,
        message: 'Test items retrieved successfully',
        data: testItems,
        count: testItems.length
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve test items',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get test item by ID
  static async getTestItemById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Test item ID is required'
        });
      }

      const testItem = await TestService.getTestItemById(id);

      if (!testItem) {
        return res.status(404).json({
          success: false,
          message: 'Test item not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Test item retrieved successfully',
        data: testItem
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve test item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update test item
  static async updateTestItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Test item ID is required'
        });
      }

      const testItem = await TestService.updateTestItem(id, updateData);

      return res.status(200).json({
        success: true,
        message: 'Test item updated successfully',
        data: testItem
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update test item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete test item
  static async deleteTestItem(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Test item ID is required'
        });
      }

      await TestService.deleteTestItem(id);

      return res.status(200).json({
        success: true,
        message: 'Test item deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete test item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get test items by user ID
  static async getTestItemsByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const testItems = await TestService.getTestItemsByUserId(userId);

      return res.status(200).json({
        success: true,
        message: 'User test items retrieved successfully',
        data: testItems,
        count: testItems.length
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user test items',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Bulk operations for testing
  static async bulkCreateTestItems(req: Request, res: Response) {
    try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Items array is required and must not be empty'
        });
      }

      const createdItems: TestItem[] = [];
      const errors: string[] = [];

      for (const item of items) {
        try {
          const testItem = await TestService.createTestItem({
            name: item.name,
            description: item.description,
            value: item.value || 0,
            user_id: item.user_id,
            is_active: true
          });
          createdItems.push(testItem);
        } catch (error) {
          errors.push(`Failed to create item "${item.name}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return res.status(201).json({
        success: true,
        message: `Bulk creation completed. Created ${createdItems.length} items${errors.length > 0 ? ` with ${errors.length} errors` : ''}`,
        data: {
          created: createdItems,
          errors: errors
        },
        stats: {
          total_requested: items.length,
          successful: createdItems.length,
          failed: errors.length
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to bulk create test items',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
