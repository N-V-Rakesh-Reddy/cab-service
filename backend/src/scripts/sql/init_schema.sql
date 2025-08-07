-- RV Cabs & Travels - Supabase SQL Schema
-- Generated on 2025-08-06 14:49:50

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mobile_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR,
    email VARCHAR,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP_SESSIONS
DO $$ BEGIN
    CREATE TYPE otp_status AS ENUM ('pending', 'verified', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS otp_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    otp_code VARCHAR(6),
    status otp_status,
    attempt_count INT DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PACKAGES
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR NOT NULL,
    description TEXT,
    location VARCHAR,
    duration_days INT,
    price DECIMAL,
    vehicle_type VARCHAR,
    tags TEXT[],
    image_url VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PACKAGE_SEGMENTS
DO $$ BEGIN
    CREATE TYPE segment_type AS ENUM ('pickup', 'drop', 'intermediate');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS package_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID REFERENCES packages(id),
    type segment_type,
    "order" INT,
    location_name TEXT,
    lat DECIMAL(9,6),
    lng DECIMAL(9,6)
);

-- DRIVERS (moved before CARS to satisfy foreign key constraint)
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR,
    phone_number VARCHAR UNIQUE,
    license_number VARCHAR UNIQUE,
    rating DECIMAL(2,1) DEFAULT 4.5,
    is_active BOOLEAN DEFAULT TRUE,
    vehicle_model VARCHAR,
    vehicle_number VARCHAR,
    vehicle_type VARCHAR DEFAULT 'sedan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CARS
DO $$ BEGIN
    CREATE TYPE car_status AS ENUM ('available', 'booked', 'maintenance', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make VARCHAR NOT NULL,
    model VARCHAR NOT NULL,
    year INTEGER,
    color VARCHAR,
    license_plate VARCHAR UNIQUE NOT NULL,
    vehicle_type VARCHAR NOT NULL, -- hatchback, sedan, suv, luxury
    seating_capacity INTEGER DEFAULT 4,
    fuel_type VARCHAR DEFAULT 'petrol', -- petrol, diesel, cng, electric
    transmission VARCHAR DEFAULT 'manual', -- manual, automatic
    features TEXT[], -- AC, GPS, Music System, etc.
    base_price_per_km DECIMAL(5,2) DEFAULT 10.00,
    price_multiplier DECIMAL(3,2) DEFAULT 1.0, -- matches frontend priceMultiplier
    is_available BOOLEAN DEFAULT TRUE,
    status car_status DEFAULT 'available',
    mileage DECIMAL(5,2), -- km per liter or km per charge
    registration_expiry DATE,
    insurance_expiry DATE,
    last_service_date DATE,
    next_service_due DATE,
    location_city VARCHAR,
    location_area VARCHAR,
    driver_id UUID REFERENCES drivers(id), -- Optional: assigned driver
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOOKINGS
DO $$ BEGIN
    CREATE TYPE booking_type AS ENUM ('one_way', 'round_trip', 'local', 'airport', 'package');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'ongoing', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    package_id UUID REFERENCES packages(id),
    booking_type booking_type,
    status booking_status,
    vehicle_type VARCHAR,
    car_id UUID REFERENCES cars(id), -- Reference to specific car
    scheduled_at TIMESTAMP,
    return_at TIMESTAMP,
    total_price DECIMAL,
    payment_status payment_status,
    driver_id UUID REFERENCES drivers(id),
    estimated_distance DECIMAL(10,2),
    estimated_duration INTEGER, -- in minutes
    payment_method VARCHAR DEFAULT 'online',
    special_requests TEXT,
    passenger_count INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TRIP_SEGMENTS
CREATE TABLE IF NOT EXISTS trip_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    type segment_type,
    "order" INT,
    location_name TEXT,
    lat DECIMAL(9,6),
    lng DECIMAL(9,6)
);

-- TEST_ITEMS (DUMMY TABLE FOR TESTING)
CREATE TABLE IF NOT EXISTS test_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    value INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
