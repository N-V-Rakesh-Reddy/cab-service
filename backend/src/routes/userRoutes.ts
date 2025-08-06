import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// User routes (no /users prefix needed since it's added in main routes)
router.get('/:id', userController.getUser.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.get('/:id/bookings', userController.getUserBookings.bind(userController));
router.get('/', userController.listUsers.bind(userController));

export default router;
