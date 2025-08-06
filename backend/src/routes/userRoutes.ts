import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

// User profile routes
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);

// User bookings
router.get('/bookings', UserController.getUserBookings);

export { router as userRoutes };
