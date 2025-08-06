import { supabase } from '../config/supabase';
import { 
  Booking, 
  BookingInsert, 
  BookingUpdate, 
  TripSegment, 
  BookingType, 
  BookingStatus,
  PaymentStatus,
  SegmentType,
  ApiResponse
} from '../models';
import { AppError } from '../common/errorHandler';
import { logger } from '../utils/logger';

export class BookingService {
  /**
   * Create a new booking
   */
  static async createBooking(userId: string, bookingData: BookingInsert & {
    trip_segments?: Array<{
      type: SegmentType;
      order: number;
      location_name: string;
      lat?: number;
      lng?: number;
    }>;
    special_requests?: string;
    passenger_count?: number;
    time_package?: string;
    flight_details?: {
      flight_number?: string;
      airline?: string;
      is_arrival?: boolean;
    };
  }): Promise<ApiResponse<Booking>> {
    try {
      // Validate booking type
      if (bookingData.booking_type && !['one_way', 'round_trip', 'local', 'airport', 'package'].includes(bookingData.booking_type)) {
        throw new AppError('Invalid booking type', 400);
      }

      // Start a transaction by creating the booking first
      const bookingToInsert: BookingInsert = {
        user_id: userId,
        package_id: bookingData.package_id,
        booking_type: bookingData.booking_type || 'one_way',
        status: 'pending' as BookingStatus,
        vehicle_type: bookingData.vehicle_type || 'sedan',
        scheduled_at: bookingData.scheduled_at,
        return_at: bookingData.return_at,
        total_price: bookingData.total_price || 0,
        payment_status: 'unpaid' as PaymentStatus,
        driver_id: bookingData.driver_id
      };

      // Insert booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingToInsert])
        .select('*')
        .single();

      if (bookingError) {
        logger.error('Error creating booking:', { error: bookingError });
        throw new AppError('Failed to create booking', 500);
      }

      // Insert trip segments if provided
      if (bookingData.trip_segments && bookingData.trip_segments.length > 0) {
        const segments = bookingData.trip_segments.map(segment => ({
          booking_id: booking.id,
          type: segment.type,
          order: segment.order,
          location_name: segment.location_name,
          lat: segment.lat,
          lng: segment.lng
        }));

        const { error: segmentsError } = await supabase
          .from('trip_segments')
          .insert(segments);

        if (segmentsError) {
          logger.error('Error creating trip segments:', { error: segmentsError });
          // Don't fail the booking, but log the error
        }
      }

      logger.info(`Booking created successfully: ${booking.id}`, { bookingId: booking.id });

      return {
        success: true,
        data: booking as Booking,
        message: 'Booking created successfully'
      };

    } catch (error) {
      logger.error('BookingService.createBooking error:', { error: error instanceof Error ? error.message : String(error) });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create booking', 500);
    }
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(bookingId: string, userId?: string): Promise<ApiResponse<Booking & { trip_segments?: TripSegment[] }>> {
    try {
      // Query booking with optional user filter
      let query = supabase
        .from('bookings')
        .select(`
          *,
          trip_segments (*)
        `)
        .eq('id', bookingId);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: booking, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('Booking not found', 404);
        }
        logger.error('Error fetching booking:', { error: error.message });
        throw new AppError('Failed to fetch booking', 500);
      }

      return {
        success: true,
        data: booking as Booking & { trip_segments?: TripSegment[] },
        message: 'Booking retrieved successfully'
      };

    } catch (error) {
      logger.error('BookingService.getBookingById error:', { error: error instanceof Error ? error.message : String(error) });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch booking', 500);
    }
  }

  /**
   * Get all bookings for a user
   */
  static async getUserBookings(userId: string, options: {
    status?: BookingStatus;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<(Booking & { trip_segments?: TripSegment[] })[]>> {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          trip_segments (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (options.status) {
        query = query.eq('status', options.status);
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1);
      }

      const { data: bookings, error } = await query;

      if (error) {
        logger.error('Error fetching user bookings:', { error: error.message });
        throw new AppError('Failed to fetch bookings', 500);
      }

      return {
        success: true,
        data: bookings as (Booking & { trip_segments?: TripSegment[] })[],
        message: 'Bookings retrieved successfully'
      };

    } catch (error) {
      logger.error('BookingService.getUserBookings error:', { error: error instanceof Error ? error.message : String(error) });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch bookings', 500);
    }
  }

  /**
   * Update booking status
   */
  static async updateBookingStatus(
    bookingId: string, 
    status: BookingStatus,
    userId?: string
  ): Promise<ApiResponse<Booking>> {
    try {
      let query = supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: booking, error } = await query
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('Booking not found', 404);
        }
        logger.error('Error updating booking status:', { error: error.message });
        throw new AppError('Failed to update booking status', 500);
      }

      logger.info(`Booking ${bookingId} status updated to ${status}`, { bookingId, status });

      return {
        success: true,
        data: booking as Booking,
        message: 'Booking status updated successfully'
      };

    } catch (error) {
      logger.error('BookingService.updateBookingStatus error:', { error: error instanceof Error ? error.message : String(error) });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update booking status', 500);
    }
  }

  /**
   * Update booking payment status
   */
  static async updatePaymentStatus(
    bookingId: string,
    paymentStatus: PaymentStatus,
    userId?: string
  ): Promise<ApiResponse<Booking>> {
    try {
      let query = supabase
        .from('bookings')
        .update({ 
          payment_status: paymentStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', bookingId);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: booking, error } = await query
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new AppError('Booking not found', 404);
        }
        logger.error('Error updating payment status:', { error: error.message });
        throw new AppError('Failed to update payment status', 500);
      }

      logger.info(`Booking ${bookingId} payment status updated to ${paymentStatus}`, { bookingId, paymentStatus });

      return {
        success: true,
        data: booking as Booking,
        message: 'Payment status updated successfully'
      };

    } catch (error) {
      logger.error('BookingService.updatePaymentStatus error:', { error: error instanceof Error ? error.message : String(error) });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update payment status', 500);
    }
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(bookingId: string, userId: string): Promise<ApiResponse<Booking>> {
    try {
      // First check if booking exists and belongs to user
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !existingBooking) {
        throw new AppError('Booking not found', 404);
      }

      // Check if booking can be cancelled
      if (existingBooking.status === 'completed' || existingBooking.status === 'cancelled') {
        throw new AppError('Cannot cancel this booking', 400);
      }

      // Update booking status to cancelled
      const { data: booking, error } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled' as BookingStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        logger.error('Error cancelling booking:', { error: error.message });
        throw new AppError('Failed to cancel booking', 500);
      }

      logger.info(`Booking ${bookingId} cancelled by user ${userId}`, { bookingId, userId });

      return {
        success: true,
        data: booking as Booking,
        message: 'Booking cancelled successfully'
      };

    } catch (error) {
      logger.error('BookingService.cancelBooking error:', { error: error instanceof Error ? error.message : String(error) });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to cancel booking', 500);
    }
  }

  /**
   * Calculate fare estimate (mock implementation)
   */
  static async calculateFareEstimate(params: {
    booking_type: BookingType;
    vehicle_type: string;
    pickup_location?: string;
    drop_location?: string;
    time_package?: string;
    passenger_count?: number;
  }): Promise<ApiResponse<{
    base_fare: number;
    distance_fare: number;
    time_fare: number;
    total_fare: number;
    currency: string;
  }>> {
    try {
      // Mock fare calculation - replace with actual calculation logic
      let baseFare = 0;
      let distanceFare = 0;
      let timeFare = 0;

      // Base fare by vehicle type
      const vehicleBaseFare = {
        'hatchback': 100,
        'sedan': 150,
        'suv': 200,
        'luxury': 300,
        'tempo-traveller': 500
      };

      baseFare = vehicleBaseFare[params.vehicle_type as keyof typeof vehicleBaseFare] || 150;

      // Distance-based calculation (mock)
      if (params.booking_type === 'local') {
        // Local package rates
        const packageRates = {
          '4hr': 800,
          '8hr': 1200,
          '12hr': 1600
        };
        timeFare = packageRates[params.time_package as keyof typeof packageRates] || 1200;
      } else {
        // Distance-based fare (mock - 50km average)
        distanceFare = 50 * 12; // ₹12 per km
      }

      // Round trip multiplier
      if (params.booking_type === 'round_trip') {
        distanceFare *= 1.8; // Slight discount for round trip
      }

      const totalFare = baseFare + distanceFare + timeFare;

      return {
        success: true,
        data: {
          base_fare: baseFare,
          distance_fare: distanceFare,
          time_fare: timeFare,
          total_fare: Math.round(totalFare),
          currency: 'INR'
        },
        message: 'Fare calculated successfully'
      };

    } catch (error) {
      logger.error('BookingService.calculateFareEstimate error:', { error: error instanceof Error ? error.message : String(error) });
      throw new AppError('Failed to calculate fare', 500);
    }
  }
}