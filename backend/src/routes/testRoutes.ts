import { Router } from 'express';
import { TestController } from '../controllers/testController';

const router = Router();

// Test database connection
router.get('/test-connection', TestController.testConnection);

// CRUD operations for test items
router.post('/items', TestController.createTestItem);
router.get('/items', TestController.getAllTestItems);
router.get('/items/:id', TestController.getTestItemById);
router.put('/items/:id', TestController.updateTestItem);
router.delete('/items/:id', TestController.deleteTestItem);

// User-specific operations
router.get('/users/:userId/items', TestController.getTestItemsByUserId);

// Bulk operations
router.post('/items/bulk', TestController.bulkCreateTestItems);

export { router as testRoutes };
