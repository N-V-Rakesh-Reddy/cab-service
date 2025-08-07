// Database Schema-Accurate TypeScript Models
// Generated from init_schema.sql to ensure type safety

// =============================================================================
// CORE DATABASE ENTITIES (matching SQL schema exactly)
// =============================================================================

// Base interface for database entities
export interface BaseEntity {
  id: string; // UUID
  created_at: string; // TIMESTAMP
  updated_at?: string; // TIMESTAMP (optional for some tables)
}

// =============================================================================
// ENUMS (matching PostgreSQL ENUM types)
// =============================================================================

export type OtpStatus = 'pending' | 'verified' | 'expired';
export type SegmentType = 'pickup' | 'drop' | 'intermediate';
export type BookingType = 'one_way' | 'round_trip' | 'local' | 'airport' | 'package';
export type BookingStatus = 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';
export type CarStatus = 'available' | 'booked' | 'maintenance' | 'inactive';

// =============================================================================
// DATABASE TABLES (exactly matching SQL schema)
// =============================================================================

// USERS table
export interface User extends BaseEntity {
  mobile_number: string; // VARCHAR(15) UNIQUE NOT NULL
  full_name?: string; // VARCHAR
  email?: string; // VARCHAR
  is_verified: boolean; // BOOLEAN DEFAULT FALSE
  // Note: updated_at is included from BaseEntity
}

// OTP_SESSIONS table
export interface OtpSession {
  id: string; // UUID PRIMARY KEY
  user_id?: string; // UUID REFERENCES users(id)
  otp_code?: string; // VARCHAR(6)
  status?: OtpStatus; // otp_status ENUM
  attempt_count: number; // INT DEFAULT 0
  expires_at?: string; // TIMESTAMP
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  // Note: No updated_at field in this table
}

// PACKAGES table
export interface Package {
  id: string; // UUID PRIMARY KEY
  title: string; // VARCHAR NOT NULL
  description?: string; // TEXT
  location?: string; // VARCHAR
  duration_days?: number; // INT
  price?: number; // DECIMAL
  vehicle_type?: string; // VARCHAR
  tags?: string[]; // TEXT[]
  image_url?: string; // VARCHAR
  is_active: boolean; // BOOLEAN DEFAULT TRUE
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  // Note: No updated_at field in this table
}

// PACKAGE_SEGMENTS table
export interface PackageSegment {
  id: string; // UUID PRIMARY KEY
  package_id?: string; // UUID REFERENCES packages(id)
  type?: SegmentType; // segment_type ENUM
  order?: number; // INT (quoted as "order" in SQL)
  location_name?: string; // TEXT
  lat?: number; // DECIMAL(9,6)
  lng?: number; // DECIMAL(9,6)
  // Note: No timestamps in this table
}

// CARS table
export interface Car extends BaseEntity {
  make: string; // VARCHAR NOT NULL
  model: string; // VARCHAR NOT NULL
  year?: number; // INTEGER
  color?: string; // VARCHAR
  license_plate: string; // VARCHAR UNIQUE NOT NULL
  vehicle_type: string; // VARCHAR NOT NULL (hatchback, sedan, suv, luxury)
  seating_capacity?: number; // INTEGER DEFAULT 4
  fuel_type?: string; // VARCHAR DEFAULT 'petrol'
  transmission?: string; // VARCHAR DEFAULT 'manual'
  features?: string[]; // TEXT[]
  base_price_per_km?: number; // DECIMAL(5,2) DEFAULT 10.00
  price_multiplier?: number; // DECIMAL(3,2) DEFAULT 1.0
  is_available?: boolean; // BOOLEAN DEFAULT TRUE
  status?: CarStatus; // car_status ENUM DEFAULT 'available'
  mileage?: number; // DECIMAL(5,2)
  registration_expiry?: string; // DATE
  insurance_expiry?: string; // DATE
  last_service_date?: string; // DATE
  next_service_due?: string; // DATE
  location_city?: string; // VARCHAR
  location_area?: string; // VARCHAR
  driver_id?: string; // UUID REFERENCES drivers(id)
  // Note: updated_at is included from BaseEntity
}

// BOOKINGS table
export interface Booking extends BaseEntity {
  user_id?: string; // UUID REFERENCES users(id)
  package_id?: string; // UUID REFERENCES packages(id)
  booking_type?: BookingType; // booking_type ENUM
  status?: BookingStatus; // booking_status ENUM
  vehicle_type?: string; // VARCHAR
  car_id?: string; // UUID REFERENCES cars(id)
  scheduled_at?: string; // TIMESTAMP
  return_at?: string; // TIMESTAMP
  total_price?: number; // DECIMAL
  payment_status?: PaymentStatus; // payment_status ENUM
  driver_id?: string; // UUID REFERENCES drivers(id)
  estimated_distance?: number; // DECIMAL(10,2)
  estimated_duration?: number; // INTEGER (minutes)
  payment_method?: string; // VARCHAR
  special_requests?: string; // TEXT
  passenger_count?: number; // INTEGER
  // Note: updated_at is included from BaseEntity
}

// TRIP_SEGMENTS table
export interface TripSegment {
  id: string; // UUID PRIMARY KEY
  booking_id?: string; // UUID REFERENCES bookings(id)
  type?: SegmentType; // segment_type ENUM
  order?: number; // INT (quoted as "order" in SQL)
  location_name?: string; // TEXT
  lat?: number; // DECIMAL(9,6)
  lng?: number; // DECIMAL(9,6)
  // Note: No timestamps in this table
}

// DRIVERS table
export interface Driver {
  id: string; // UUID PRIMARY KEY
  name?: string; // VARCHAR
  phone_number?: string; // VARCHAR UNIQUE
  license_number?: string; // VARCHAR UNIQUE
  rating?: number; // DECIMAL(2,1)
  is_active?: boolean; // BOOLEAN
  vehicle_model?: string; // VARCHAR
  vehicle_number?: string; // VARCHAR
  vehicle_type?: string; // VARCHAR
  created_at: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  // Note: No updated_at field in this table
}

// TEST_ITEMS table (for testing)
export interface TestItem extends BaseEntity {
  name: string; // VARCHAR NOT NULL
  description?: string; // TEXT
  value: number; // INTEGER DEFAULT 0
  is_active: boolean; // BOOLEAN DEFAULT TRUE
  user_id?: string; // UUID REFERENCES users(id)
  // Note: updated_at is included from BaseEntity
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// =============================================================================
// REQUEST/RESPONSE DTOs
// =============================================================================

// Authentication DTOs
export interface SendOtpRequest {
  phone: string; // Frontend uses 'phone' but maps to 'mobile_number' in DB
}

export interface VerifyOtpRequest {
  phone: string; // Frontend uses 'phone' but maps to 'mobile_number' in DB
  otp: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// User DTOs
export interface UpdateUserRequest {
  full_name?: string; // Maps to 'full_name' in DB
  email?: string;
}

// Booking DTOs
export interface CreateBookingRequest {
  package_id?: string;
  booking_type?: BookingType;
  vehicle_type?: string;
  scheduled_at?: string;
  return_at?: string;
  total_price?: number;
  special_requests?: string; // This might need to be added to schema
}

// =============================================================================
// UTILITY TYPES FOR TYPE SAFETY
// =============================================================================

// Type for database insert operations (excludes generated fields)
export type UserInsert = Omit<User, 'id' | 'created_at' | 'updated_at'> & {
  mobile_number: string; // Ensure required field
};

export type BookingInsert = Omit<Booking, 'id' | 'created_at' | 'updated_at'>;

export type CarInsert = Omit<Car, 'id' | 'created_at' | 'updated_at'> & {
  make: string; // Ensure required field
  model: string; // Ensure required field
  license_plate: string; // Ensure required field
  vehicle_type: string; // Ensure required field
};

export type TestItemInsert = Omit<TestItem, 'id' | 'created_at' | 'updated_at'> & {
  name: string; // Ensure required field
};

// Type for database update operations (excludes immutable fields)
export type UserUpdate = Partial<Omit<User, 'id' | 'created_at' | 'mobile_number'>>;
export type BookingUpdate = Partial<Omit<Booking, 'id' | 'created_at' | 'user_id'>>;
export type CarUpdate = Partial<Omit<Car, 'id' | 'created_at' | 'license_plate'>>;

// =============================================================================
// TYPE GUARDS FOR RUNTIME TYPE CHECKING
// =============================================================================

export function isValidBookingType(type: string): type is BookingType {
  return ['one_way', 'round_trip', 'local', 'airport', 'package'].includes(type);
}

export function isValidBookingStatus(status: string): status is BookingStatus {
  return ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'].includes(status);
}

export function isValidOtpStatus(status: string): status is OtpStatus {
  return ['pending', 'verified', 'expired'].includes(status);
}

export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return ['unpaid', 'paid', 'failed', 'refunded'].includes(status);
}

export function isValidCarStatus(status: string): status is CarStatus {
  return ['available', 'booked', 'maintenance', 'inactive'].includes(status);
}

export function isValidVehicleType(type: string): boolean {
  return ['hatchback', 'sedan', 'suv', 'luxury'].includes(type);
}
