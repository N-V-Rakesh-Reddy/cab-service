import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/bookingService';
import { BaseController } from './BaseController';
import { 
  BookingType, 
  BookingStatus, 
  PaymentStatus,
  SegmentType,
  isValidBookingType,
  isValidBookingStatus,
  isValidPaymentStatus
} from '../models';
import { AppError } from '../common/errorHandler';
import { logger } from '../utils/logger';

export class BookingController extends BaseController {
  /**
   * Create a new booking
   */
  static async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const {
        booking_type,
        package_id,
        vehicle_type,
        scheduled_at,
        return_at,
        total_price,
        pickup_location,
        drop_location,
        intermediate_stops,
        special_requests,
        passenger_count,
        time_package,
        flight_details
      } = req.body;

      // Validate required fields
      if (!booking_type || !isValidBookingType(booking_type)) {
        throw new AppError('Valid booking type is required', 400);
      }

      if (!scheduled_at) {
        throw new AppError('Scheduled date and time is required', 400);
      }

      // Validate booking type specific requirements
      if (booking_type !== 'local' && !pickup_location) {
        throw new AppError('Pickup location is required', 400);
      }

      if (!['local', 'package'].includes(booking_type) && !drop_location) {
        throw new AppError('Drop location is required for this booking type', 400);
      }

      if (booking_type === 'round_trip' && !return_at) {
        throw new AppError('Return date and time is required for round trip', 400);
      }

      if (booking_type === 'airport' && (!flight_details?.flight_number || !flight_details?.airline)) {
        throw new AppError('Flight details are required for airport transfers', 400);
      }

      if (booking_type === 'package' && !package_id) {
        throw new AppError('Package ID is required for package bookings', 400);
      }

      // Build trip segments from locations
      const trip_segments: Array<{
        type: SegmentType;
        order: number;
        location_name: string;
        lat?: number;
        lng?: number;
      }> = [];

      // Add pickup location
      if (pickup_location) {
        trip_segments.push({
          type: 'pickup' as SegmentType,
          order: 1,
          location_name: pickup_location
        });
      }

      // Add intermediate stops
      if (intermediate_stops && Array.isArray(intermediate_stops)) {
        intermediate_stops.forEach((stop: string, index: number) => {
          if (stop.trim()) {
            trip_segments.push({
              type: 'intermediate' as SegmentType,
              order: index + 2,
              location_name: stop.trim()
            });
          }
        });
      }

      // Add drop location
      if (drop_location) {
        trip_segments.push({
          type: 'drop' as SegmentType,
          order: trip_segments.length + 1,
          location_name: drop_location
        });
      }

      const bookingData = {
        booking_type: booking_type as BookingType,
        package_id,
        vehicle_type: vehicle_type || 'sedan',
        scheduled_at,
        return_at,
        total_price: total_price || 0,
        trip_segments,
        special_requests,
        passenger_count,
        time_package,
        flight_details
      };

      const result = await BookingService.createBooking(userId, bookingData);

      logger.info(`Booking created by user ${userId}: ${result.data?.id}`, { userId, bookingId: result.data?.id });

      return BaseController.sendSuccessResponse(res, result.data, result.message, 201);

    } catch (error) {
      logger.error('BookingController.createBooking error:', { error: error instanceof Error ? error.message : String(error) });
      next(error);
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: bookingId } = req.params;
      const userId = req.user?.id;

      if (!bookingId) {
        throw new AppError('Booking ID is required', 400);
      }

      // For regular users, only allow access to their own bookings
      const result = await BookingService.getBookingById(bookingId, userId);

      return BaseController.sendSuccessResponse(res, result.data, result.message);

    } catch (error) {
      logger.error('BookingController.getBookingById error:', { error: error instanceof Error ? error.message : String(error) });
      next(error);
    }
  }

  /**
   * Get user's bookings
   */
  static async getUserBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const { 
        status, 
        limit = '10', 
        offset = '0' 
      } = req.query;

      const options: {
        status?: BookingStatus;
        limit?: number;
        offset?: number;
      } = {
        limit: Math.min(parseInt(limit as string, 10) || 10, 100), // Max 100 items
        offset: parseInt(offset as string, 10) || 0
      };

      // Validate status filter
      if (status && typeof status === 'string' && isValidBookingStatus(status)) {
        options.status = status as BookingStatus;
      }

      const result = await BookingService.getUserBookings(userId, options);

      return BaseController.sendSuccessResponse(res, result.data, result.message);

    } catch (error) {
      logger.error('BookingController.getUserBookings error:', { error: error instanceof Error ? error.message : String(error) });
      next(error);
    }
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: bookingId } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      if (!bookingId) {
        throw new AppError('Booking ID is required', 400);
      }

      if (!status || !isValidBookingStatus(status)) {
        throw new AppError('Valid booking status is required', 400);
      }

      // For regular users, only allow certain status updates on their own bookings
      const allowedUserStatuses: BookingStatus[] = ['cancelled'];
      if (userId && !allowedUserStatuses.includes(status as BookingStatus)) {
        throw new AppError('Unauthorized status update', 403);
      }

      const result = await BookingService.updateBookingStatus(bookingId, status as BookingStatus, userId);

      logger.info(`Booking ${bookingId} status updated to ${status} by user ${userId}`, { bookingId, status, userId });

      return BaseController.sendSuccessResponse(res, result.data, result.message);

    } catch (error) {
      logger.error('BookingController.updateBookingStatus error:', { error: error instanceof Error ? error.message : String(error) });
      next(error);
    }
  }

  /**
   * Cancel booking (convenience method)
   */
  static async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: bookingId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      if (!bookingId) {
        throw new AppError('Booking ID is required', 400);
      }

      const result = await BookingService.cancelBooking(bookingId, userId);

      logger.info(`Booking ${bookingId} cancelled by user ${userId}`, { bookingId, userId });

      return BaseController.sendSuccessResponse(res, result.data, result.message);

    } catch (error) {
      logger.error('BookingController.cancelBooking error:', { error: error instanceof Error ? error.message : String(error) });
      next(error);
    }
  }

  /**
   * Get fare estimate
   */
  static async getFareEstimate(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        booking_type,
        vehicle_type,
        pickup_location,
        drop_location,
        time_package,
        passenger_count
      } = req.query;

      if (!booking_type || !isValidBookingType(booking_type as string)) {
        throw new AppError('Valid booking type is required', 400);
      }

      if (!vehicle_type) {
        throw new AppError('Vehicle type is required', 400);
      }

      const params = {
        booking_type: booking_type as BookingType,
        vehicle_type: vehicle_type as string,
        pickup_location: pickup_location as string,
        drop_location: drop_location as string,
        time_package: time_package as string,
        passenger_count: passenger_count ? parseInt(passenger_count as string, 10) : 1
      };

      const result = await BookingService.calculateFareEstimate(params);

      return BaseController.sendSuccessResponse(res, result.data, result.message);

    } catch (error) {
      logger.error('BookingController.getFareEstimate error:', { error: error instanceof Error ? error.message : String(error) });
      next(error);
    }
  }

  /**
   * Update payment status (for payment webhook/callback)
   */
  static async updatePaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: bookingId } = req.params;
      const { payment_status } = req.body;

      if (!bookingId) {
        throw new AppError('Booking ID is required', 400);
      }

      if (!payment_status || !isValidPaymentStatus(payment_status)) {
        throw new AppError('Valid payment status is required', 400);
      }

      // For payment webhooks, don't restrict by user
      const result = await BookingService.updatePaymentStatus(bookingId, payment_status as PaymentStatus);

      logger.info(`Booking ${bookingId} payment status updated to ${payment_status}`, { bookingId, payment_status });

      return BaseController.sendSuccessResponse(res, result.data, result.message);

    } catch (error) {
      logger.error('BookingController.updatePaymentStatus error:', { error: error instanceof Error ? error.message : String(error) });
      next(error);
    }
  }
}