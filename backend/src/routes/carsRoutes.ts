import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { Car, ApiResponse } from '../models';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/cars
 * Fetch all available cars
 * Query params:
 * - vehicle_type: Filter by vehicle type (hatchback, sedan, suv, luxury)
 * - location_city: Filter by city
 * - seating_capacity: Minimum seating capacity
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      vehicle_type, 
      location_city, 
      seating_capacity 
    } = req.query;

    let query = supabaseAdmin
      .from('cars')
      .select('*')
      .eq('is_available', true)
      .eq('status', 'available')
      .order('price_multiplier', { ascending: true }); // Sort by price

    // Apply filters
    if (vehicle_type) {
      query = query.eq('vehicle_type', vehicle_type);
    }

    if (location_city) {
      query = query.eq('location_city', location_city);
    }

    if (seating_capacity) {
      query = query.gte('seating_capacity', parseInt(seating_capacity as string));
    }

    const { data: cars, error } = await query;

    if (error) {
      logger.error('Error fetching cars:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch available cars'
      } as ApiResponse);
    }

    // Group cars by vehicle type for easy frontend consumption
    const groupedCars = cars?.reduce((acc, car) => {
      const type = car.vehicle_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(car);
      return acc;
    }, {} as Record<string, Car[]>) || {};

    logger.info(`Fetched ${cars?.length || 0} available cars`);

    res.json({
      success: true,
      data: {
        cars,
        groupedByType: groupedCars,
        totalCount: cars?.length || 0
      }
    } as ApiResponse);

  } catch (error) {
    logger.error('Error in cars endpoint:', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

/**
 * GET /api/cars/:id
 * Fetch specific car details
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: car, error } = await supabaseAdmin
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error fetching car:', { error: error.message, carId: id });
      return res.status(404).json({
        success: false,
        error: 'Car not found'
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: car
    } as ApiResponse<Car>);

  } catch (error) {
    logger.error('Error in car detail endpoint:', { 
      error: error instanceof Error ? error.message : String(error),
      carId: req.params.id 
    });
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

/**
 * GET /api/cars/types/summary
 * Get summary of available cars by type (for quick overview)
 */
router.get('/types/summary', async (req: Request, res: Response) => {
  try {
    const { data: cars, error } = await supabaseAdmin
      .from('cars')
      .select('vehicle_type, price_multiplier, base_price_per_km, seating_capacity')
      .eq('is_available', true)
      .eq('status', 'available');

    if (error) {
      logger.error('Error fetching car types summary:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch car types summary'
      } as ApiResponse);
    }

    // Create summary by vehicle type
    const summary = cars?.reduce((acc, car) => {
      const type = car.vehicle_type;
      if (!acc[type]) {
        acc[type] = {
          type,
          count: 0,
          priceRange: { min: Infinity, max: 0 },
          seatingCapacities: new Set<number>()
        };
      }
      
      acc[type].count++;
      acc[type].priceRange.min = Math.min(acc[type].priceRange.min, car.base_price_per_km || 0);
      acc[type].priceRange.max = Math.max(acc[type].priceRange.max, car.base_price_per_km || 0);
      acc[type].seatingCapacities.add(car.seating_capacity || 4);
      
      return acc;
    }, {} as Record<string, any>) || {};

    // Convert Set to Array for JSON serialization
    Object.keys(summary).forEach(type => {
      summary[type].seatingCapacities = Array.from(summary[type].seatingCapacities);
    });

    res.json({
      success: true,
      data: summary
    } as ApiResponse);

  } catch (error) {
    logger.error('Error in car types summary endpoint:', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

export default router;