import { Router, Request, Response } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase';
import { Package, PackageSegment, ApiResponse, Booking, BookingInsert } from '../models';
import { logger } from '../utils/logger';

const router = Router();

interface PackageWithSegments extends Package {
  segments?: PackageSegment[];
}

interface PackageBookingRequest {
  packageId: string;
  scheduledAt: string;
  passengerCount?: number;
  specialRequests?: string;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const { vehicle_type, location, active, limit, offset } = req.query;

    let query = supabase
      .from('packages')
      .select(`
        *,
        package_segments (
          id,
          type,
          order,
          location_name,
          lat,
          lng
        )
      `)
      .order('created_at', { ascending: false });

    if (vehicle_type) {
      query = query.eq('vehicle_type', vehicle_type);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    if (active !== undefined) {
      query = query.eq('is_active', active === 'true');
    } else {
      query = query.eq('is_active', true);
    }

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    if (offset) {
      query = query.range(
        parseInt(offset as string),
        parseInt(offset as string) + parseInt((limit as string) || '10') - 1
      );
    }

    const { data: packages, error } = await query;

    if (error) {
      logger.error('Error fetching packages:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch packages'
      } as ApiResponse);
    }

    const packagesWithSegments: PackageWithSegments[] = packages?.map(pkg => ({
      ...pkg,
      segments: pkg.package_segments
    })) || [];

    packagesWithSegments.forEach(pkg => {
      delete (pkg as any).package_segments;
    });

    res.json({
      success: true,
      data: packagesWithSegments
    } as ApiResponse<PackageWithSegments[]>);

  } catch (error) {
    logger.error('Error in GET /packages:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: packageData, error } = await supabase
      .from('packages')
      .select(`
        *,
        package_segments (
          id,
          type,
          order,
          location_name,
          lat,
          lng
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      logger.error('Error fetching package:', { error: error.message, packageId: id });
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      } as ApiResponse);
    }

    const packageWithSegments: PackageWithSegments = {
      ...packageData,
      segments: packageData.package_segments
    };

    delete (packageWithSegments as any).package_segments;

    res.json({
      success: true,
      data: packageWithSegments
    } as ApiResponse<PackageWithSegments>);

  } catch (error) {
    logger.error('Error in GET /packages/:id:', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

router.post('/:id/book', async (req: Request, res: Response) => {
  try {
    const { id: packageId } = req.params;
    const { scheduledAt, passengerCount, specialRequests } = req.body as PackageBookingRequest;
    const userId = (req as any).user?.id;

    logger.info('Package booking attempt:', { 
      packageId, 
      requestBody: req.body, 
      userId,
      hasUser: !!(req as any).user
    });

    if (!userId) {
      logger.error('No user ID found in request:', { user: (req as any).user });
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      } as ApiResponse);
    }

    const { data: packageData, error: packageError } = await supabaseAdmin
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .eq('is_active', true)
      .single();

    if (packageError) {
      logger.error('Error fetching package for booking:', { error: packageError.message, packageId });
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      } as ApiResponse);
    }

    const bookingData: BookingInsert = {
      user_id: userId,
      package_id: packageId,
      booking_type: 'package',
      status: 'pending',
      vehicle_type: packageData.vehicle_type || 'sedan',
      scheduled_at: scheduledAt,
      total_price: packageData.price || 0,
      payment_status: 'unpaid',
      passenger_count: passengerCount || 1,
      special_requests: specialRequests,
      payment_method: 'online'
    };

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert(bookingData)
      .select('*')
      .single();

    if (bookingError) {
      logger.error('Error creating package booking:', { error: bookingError.message, bookingData });
      return res.status(500).json({
        success: false,
        error: 'Failed to create booking'
      } as ApiResponse);
    }

    logger.info('Package booking created successfully:', { bookingId: booking.id, packageId, userId });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Package booking created successfully'
    } as ApiResponse<Booking>);

  } catch (error) {
    logger.error('Error in POST /packages/:id/book:', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      packageId: req.params.id,
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

export default router;