import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import bookingRoutes from './bookingRoutes';
import carsRoutes from './carsRoutes';
import packageRoutes from './packageRoutes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bookings', bookingRoutes);
router.use('/cars', carsRoutes);
router.use('/packages', packageRoutes);

// Health check
router.get('/health', (_, res) => res.json({ 
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '1.0.0'
}));

export default router;
