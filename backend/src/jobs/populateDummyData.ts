import { supabaseAdmin } from '../config/supabase';
import { logger } from '../utils/logger';
import { 
  User, 
  Booking, 
  TripSegment, 
  Driver, 
  Package,
  PackageSegment,
  BookingType,
  BookingStatus,
  PaymentStatus,
  SegmentType
} from '../models';

export class DummyDataPopulator {
  
  /**
   * Generate dummy users
   */
  static async createDummyUsers(): Promise<User[]> {
    const users = [
      {
        mobile_number: '+919876543210',
        full_name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        is_verified: true
      },
      {
        mobile_number: '+918765432109',
        full_name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        is_verified: true
      },
      {
        mobile_number: '+917654321098',
        full_name: 'Amit Singh',
        email: 'amit.singh@email.com',
        is_verified: true
      },
      {
        mobile_number: '+916543210987',
        full_name: 'Sneha Patel',
        email: 'sneha.patel@email.com',
        is_verified: true
      },
      {
        mobile_number: '+915432109876',
        full_name: 'Vikram Reddy',
        email: 'vikram.reddy@email.com',
        is_verified: true
      }
    ];

    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(users, { onConflict: 'mobile_number' })
      .select('*');

    if (error) {
      logger.error('Error creating dummy users:', { error: error.message });
      throw error;
    }

    logger.info(`Created ${data?.length} dummy users`, { userCount: data?.length });
    return data as User[];
  }

  /**
   * Generate dummy drivers
   */
  static async createDummyDrivers(): Promise<Driver[]> {
    // First, check if drivers already exist
    const { data: existingDrivers } = await supabaseAdmin
      .from('drivers')
      .select('*')
      .limit(1);

    if (existingDrivers && existingDrivers.length > 0) {
      logger.info('Dummy drivers already exist, skipping creation');
      const { data: allDrivers } = await supabaseAdmin
        .from('drivers')
        .select('*');
      return allDrivers as Driver[];
    }

    const drivers = [
      {
        name: 'Ravi Kumar',
        phone_number: '+919123456780',
        license_number: 'DL-12-2020-001234',
        rating: 4.8,
        is_active: true,
        vehicle_model: 'Maruti Swift Dzire',
        vehicle_number: 'DL 8C 1234',
        vehicle_type: 'sedan'
      },
      {
        name: 'Suresh Babu',
        phone_number: '+919123456781',
        license_number: 'DL-12-2020-001235',
        rating: 4.6,
        is_active: true,
        vehicle_model: 'Honda City',
        vehicle_number: 'DL 9D 5678',
        vehicle_type: 'sedan'
      },
      {
        name: 'Mahesh Singh',
        phone_number: '+919123456782',
        license_number: 'DL-12-2020-001236',
        rating: 4.9,
        is_active: true,
        vehicle_model: 'Toyota Innova',
        vehicle_number: 'HR 26 9876',
        vehicle_type: 'suv'
      },
      {
        name: 'Deepak Yadav',
        phone_number: '+919123456783',
        license_number: 'DL-12-2020-001237',
        rating: 4.7,
        is_active: true,
        vehicle_model: 'Maruti Swift',
        vehicle_number: 'UP 16 3456',
        vehicle_type: 'hatchback'
      },
      {
        name: 'Ramesh Gupta',
        phone_number: '+919123456784',
        license_number: 'DL-12-2020-001238',
        rating: 4.5,
        is_active: true,
        vehicle_model: 'BMW 3 Series',
        vehicle_number: 'DL 3C 7890',
        vehicle_type: 'luxury'
      }
    ];

    const { data, error } = await supabaseAdmin
      .from('drivers')
      .insert(drivers)
      .select('*');

    if (error) {
      logger.error('Error creating dummy drivers:', { error: error.message });
      throw error;
    }

    logger.info(`Created ${data?.length} dummy drivers`, { driverCount: data?.length });
    return data as Driver[];
  }

  /**
   * Generate dummy packages
   */
  static async createDummyPackages(): Promise<Package[]> {
    const packages = [
      {
        title: 'Golden Triangle Tour',
        description: 'Explore Delhi, Agra, and Jaipur in this classic North India tour package',
        location: 'Delhi, Agra, Jaipur',
        duration_days: 6,
        price: 25000,
        vehicle_type: 'sedan',
        tags: ['heritage', 'culture', 'monuments'],
        image_url: '/packages/golden-triangle.jpg',
        is_active: true
      },
      {
        title: 'Kerala Backwaters Experience',
        description: 'Discover the serene backwaters of Kerala with houseboat stays',
        location: 'Kerala',
        duration_days: 5,
        price: 18000,
        vehicle_type: 'suv',
        tags: ['nature', 'backwaters', 'relaxation'],
        image_url: '/packages/kerala-backwaters.jpg',
        is_active: true
      },
      {
        title: 'Rajasthan Royal Heritage',
        description: 'Experience the royal palaces and forts of Rajasthan',
        location: 'Rajasthan',
        duration_days: 8,
        price: 35000,
        vehicle_type: 'luxury',
        tags: ['heritage', 'palaces', 'desert'],
        image_url: '/packages/rajasthan-royal.jpg',
        is_active: true
      },
      {
        title: 'Goa Beach Paradise',
        description: 'Relax on the beautiful beaches of Goa',
        location: 'Goa',
        duration_days: 4,
        price: 12000,
        vehicle_type: 'hatchback',
        tags: ['beach', 'relaxation', 'nightlife'],
        image_url: '/packages/goa-beaches.jpg',
        is_active: true
      },
      {
        title: 'Himachal Mountain Adventure',
        description: 'Adventure in the mountains of Himachal Pradesh',
        location: 'Himachal Pradesh',
        duration_days: 7,
        price: 22000,
        vehicle_type: 'suv',
        tags: ['mountains', 'adventure', 'trekking'],
        image_url: '/packages/himachal-mountains.jpg',
        is_active: true
      }
    ];

    const { data, error } = await supabaseAdmin
      .from('packages')
      .insert(packages)
      .select('*');

    if (error) {
      logger.error('Error creating dummy packages:', { error: error.message });
      throw error;
    }

    logger.info(`Created ${data?.length} dummy packages`, { packageCount: data?.length });
    return data as Package[];
  }

  /**
   * Generate package segments
   */
  static async createPackageSegments(packages: Package[]): Promise<void> {
    const packageSegments: Omit<PackageSegment, 'id'>[] = [];

    packages.forEach((pkg, pkgIndex) => {
      // Create segments based on package type
      if (pkg.title?.includes('Golden Triangle')) {
        packageSegments.push(
          { package_id: pkg.id, type: 'pickup' as SegmentType, order: 1, location_name: 'Delhi Airport', lat: 28.5562, lng: 77.1000 },
          { package_id: pkg.id, type: 'intermediate' as SegmentType, order: 2, location_name: 'Red Fort Delhi', lat: 28.6562, lng: 77.2410 },
          { package_id: pkg.id, type: 'intermediate' as SegmentType, order: 3, location_name: 'Taj Mahal Agra', lat: 27.1751, lng: 78.0421 },
          { package_id: pkg.id, type: 'drop' as SegmentType, order: 4, location_name: 'Hawa Mahal Jaipur', lat: 26.9239, lng: 75.8267 }
        );
      } else if (pkg.title?.includes('Kerala')) {
        packageSegments.push(
          { package_id: pkg.id, type: 'pickup' as SegmentType, order: 1, location_name: 'Kochi Airport', lat: 10.1632, lng: 76.3871 },
          { package_id: pkg.id, type: 'intermediate' as SegmentType, order: 2, location_name: 'Alleppey Backwaters', lat: 9.4981, lng: 76.3388 },
          { package_id: pkg.id, type: 'drop' as SegmentType, order: 3, location_name: 'Kumarakom', lat: 9.6173, lng: 76.4306 }
        );
      } else {
        // Generic segments for other packages
        packageSegments.push(
          { package_id: pkg.id, type: 'pickup' as SegmentType, order: 1, location_name: `${pkg.title} Start Point` },
          { package_id: pkg.id, type: 'drop' as SegmentType, order: 2, location_name: `${pkg.title} End Point` }
        );
      }
    });

    const { error } = await supabaseAdmin
      .from('package_segments')
      .insert(packageSegments);

    if (error) {
      logger.error('Error creating package segments:', { error: error.message });
      throw error;
    }

    logger.info(`Created package segments for ${packages.length} packages`);
  }

  /**
   * Generate dummy bookings
   */
  static async createDummyBookings(users: User[], drivers: Driver[], packages: Package[]): Promise<Booking[]> {
    const bookingTypes: BookingType[] = ['one_way', 'round_trip', 'local', 'airport', 'package'];
    const bookingStatuses: BookingStatus[] = ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'];
    const paymentStatuses: PaymentStatus[] = ['unpaid', 'paid', 'failed', 'refunded'];
    const vehicleTypes = ['hatchback', 'sedan', 'suv', 'luxury'];

    const bookings: Omit<Booking, 'id' | 'created_at' | 'updated_at'>[] = [];

    // Create 20 sample bookings
    for (let i = 0; i < 20; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const driver = drivers[Math.floor(Math.random() * drivers.length)];
      const bookingType = bookingTypes[Math.floor(Math.random() * bookingTypes.length)];
      const isPackageBooking = bookingType === 'package';
      const selectedPackage = isPackageBooking ? packages[Math.floor(Math.random() * packages.length)] : null;

      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30) - 15); // Random date within ±15 days

      const returnDate = bookingType === 'round_trip' ? new Date(scheduledDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null;

      const estimatedDistance = Math.floor(Math.random() * 100) + 10; // 10-110 km
      const estimatedDuration = Math.floor(estimatedDistance * 2.5); // Rough estimate: 2.5 minutes per km
      
      bookings.push({
        user_id: user.id,
        package_id: selectedPackage?.id,
        booking_type: bookingType,
        status: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
        vehicle_type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
        scheduled_at: scheduledDate.toISOString(),
        return_at: returnDate?.toISOString(),
        total_price: Math.floor(Math.random() * 5000) + 500, // Random price between 500-5500
        payment_status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        driver_id: driver.id,
        estimated_distance: estimatedDistance,
        estimated_duration: estimatedDuration,
        payment_method: ['online', 'cash', 'card'][Math.floor(Math.random() * 3)],
        special_requests: Math.random() > 0.7 ? 'Please call before pickup' : undefined,
        passenger_count: Math.floor(Math.random() * 4) + 1 // 1-4 passengers
      });
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert(bookings)
      .select('*');

    if (error) {
      logger.error('Error creating dummy bookings:', { error: error.message });
      throw error;
    }

    logger.info(`Created ${data?.length} dummy bookings`, { bookingCount: data?.length });
    return data as Booking[];
  }

  /**
   * Generate trip segments for bookings
   */
  static async createTripSegments(bookings: Booking[]): Promise<void> {
    const tripSegments: Omit<TripSegment, 'id'>[] = [];
    
    const locations = [
      { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167 },
      { name: 'IGI Airport Terminal 3', lat: 28.5562, lng: 77.1000 },
      { name: 'India Gate, New Delhi', lat: 28.6129, lng: 77.2295 },
      { name: 'Cyber City, Gurgaon', lat: 28.4089, lng: 77.0583 },
      { name: 'Electronic City, Bangalore', lat: 12.8456, lng: 77.6603 },
      { name: 'Hitech City, Hyderabad', lat: 17.4483, lng: 78.3915 },
      { name: 'Bandra Kurla Complex, Mumbai', lat: 19.0596, lng: 72.8656 },
      { name: 'Salt Lake, Kolkata', lat: 22.5726, lng: 88.3639 }
    ];

    bookings.forEach(booking => {
      if (booking.booking_type === 'package') {
        // Package bookings already have segments via package_segments
        return;
      }

      const pickup = locations[Math.floor(Math.random() * locations.length)];
      const drop = locations[Math.floor(Math.random() * locations.length)];

      // Pickup segment
      tripSegments.push({
        booking_id: booking.id,
        type: 'pickup' as SegmentType,
        order: 1,
        location_name: pickup.name,
        lat: pickup.lat,
        lng: pickup.lng
      });

      // Drop segment (not for local trips)
      if (booking.booking_type !== 'local') {
        tripSegments.push({
          booking_id: booking.id,
          type: 'drop' as SegmentType,
          order: 2,
          location_name: drop.name,
          lat: drop.lat,
          lng: drop.lng
        });
      }

      // Random intermediate stops (20% chance)
      if (Math.random() < 0.2) {
        const intermediate = locations[Math.floor(Math.random() * locations.length)];
        tripSegments.push({
          booking_id: booking.id,
          type: 'intermediate' as SegmentType,
          order: booking.booking_type === 'local' ? 2 : 3,
          location_name: intermediate.name,
          lat: intermediate.lat,
          lng: intermediate.lng
        });
      }
    });

    if (tripSegments.length > 0) {
      const { error } = await supabaseAdmin
        .from('trip_segments')
        .insert(tripSegments);

      if (error) {
        logger.error('Error creating trip segments:', { error: error.message });
        throw error;
      }

      logger.info(`Created ${tripSegments.length} trip segments`);
    }
  }

  /**
   * Main method to populate all dummy data
   */
  static async populateAll(): Promise<void> {
    try {
      logger.info('Starting dummy data population...');

      // Create users
      const users = await this.createDummyUsers();
      
      // Create drivers
      const drivers = await this.createDummyDrivers();
      
      // Create packages
      const packages = await this.createDummyPackages();
      
      // Create package segments
      await this.createPackageSegments(packages);
      
      // Create bookings
      const bookings = await this.createDummyBookings(users, drivers, packages);
      
      // Create trip segments
      await this.createTripSegments(bookings);

      logger.info('Dummy data population completed successfully!', {
        users: users.length,
        drivers: drivers.length,
        packages: packages.length,
        bookings: bookings.length
      });

    } catch (error) {
      logger.error('Error populating dummy data:', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }

  /**
   * Clean all dummy data (for testing)
   */
  static async cleanAll(): Promise<void> {
    try {
      logger.info('Cleaning all dummy data...');

      // Delete in reverse order due to foreign key constraints
      await supabaseAdmin.from('trip_segments').delete().neq('id', '');
      await supabaseAdmin.from('package_segments').delete().neq('id', '');
      await supabaseAdmin.from('bookings').delete().neq('id', '');
      await supabaseAdmin.from('packages').delete().neq('id', '');
      await supabaseAdmin.from('drivers').delete().neq('id', '');
      await supabaseAdmin.from('users').delete().neq('id', '');

      logger.info('All dummy data cleaned successfully!');

    } catch (error) {
      logger.error('Error cleaning dummy data:', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      throw error;
    }
  }
}

// Script execution if run directly
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'clean') {
    DummyDataPopulator.cleanAll()
      .then(() => {
        console.log('✅ Dummy data cleaned successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Error cleaning dummy data:', error.message);
        process.exit(1);
      });
  } else {
    DummyDataPopulator.populateAll()
      .then(() => {
        console.log('✅ Dummy data populated successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Error populating dummy data:', error.message);
        process.exit(1);
      });
  }
}