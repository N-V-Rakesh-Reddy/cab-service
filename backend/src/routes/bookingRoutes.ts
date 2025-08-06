import { Router } from 'express';
import { BookingController } from '../controllers/bookingController';
import { unifiedAuth, requireUser } from '../middlewares/unifiedAuth';

const router = Router();

// Public routes (no auth required)
router.get('/fare-estimate', BookingController.getFareEstimate);

// Protected routes (require authentication)
router.use(unifiedAuth);
router.use(requireUser);

// Booking CRUD operations
router.post('/', BookingController.createBooking);
router.get('/', BookingController.getUserBookings);
router.get('/:id', BookingController.getBookingById);

// Booking status management
router.patch('/:id/status', BookingController.updateBookingStatus);
router.patch('/:id/cancel', BookingController.cancelBooking);

// Payment status (typically used by payment webhooks)
router.patch('/:id/payment-status', BookingController.updatePaymentStatus);

export default router;