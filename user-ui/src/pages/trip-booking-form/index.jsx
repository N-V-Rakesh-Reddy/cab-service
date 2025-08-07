import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApiService, { isUserAuthenticated } from '../../utils/api';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import MobileBottomNavigation from '../../components/ui/MobileBottomNavigation';
import AuthModal from '../../components/ui/AuthModal';
import TripStatusIndicator from '../../components/ui/TripStatusIndicator';

// Import all components
import TripTypeSelector from './components/TripTypeSelector';
import LocationInput from './components/LocationInput';
import DateTimeSelector from './components/DateTimeSelector';
import PassengerSelector from './components/PassengerSelector';
import VehicleSelector from './components/VehicleSelector';
import SpecialRequestsInput from './components/SpecialRequestsInput';
import TimePackageSelector from './components/TimePackageSelector';
import FlightDetailsForm from './components/FlightDetailsForm';
import IntermediateStops from './components/IntermediateStops';
import FareEstimation from './components/FareEstimation';

const TripBookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // User state
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Form state
  const [tripType, setTripType] = useState('one-way');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [timePackage, setTimePackage] = useState('8hr');
  const [flightNumber, setFlightNumber] = useState('');
  const [airline, setAirline] = useState('');
  const [isArrival, setIsArrival] = useState(true);
  const [intermediateStops, setIntermediateStops] = useState([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock active trip for demonstration
  const [activeTrip] = useState({
    id: 'trip_001',
    status: 'confirmed',
    eta: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
    driver: {
      name: 'Rajesh Kumar',
      vehicle: 'Maruti Swift Dzire',
      rating: 4.8
    },
    trackingUrl: '#'
  });

  useEffect(() => {
    // Check for saved user data
    const savedUser = localStorage.getItem('cabBookerUser');
    
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Check if user is properly authenticated (has valid token)
      const authToken = localStorage.getItem('auth_token');
      const userToken = userData.token;
      console.log('🔍 Auth check:', { 
        hasAuthToken: !!authToken, 
        hasUserToken: !!userToken,
        isAuthenticated: isUserAuthenticated()
      });
      
      if (isUserAuthenticated()) {
        setUser(userData);
      } else {
        // Clear invalid user data and force re-authentication
        console.log('⚠️ User exists but no valid auth token found, clearing data and requiring re-authentication');
        localStorage.removeItem('cabBookerUser');
        setUser(null);
        setShowAuthModal(true);
      }
    }

    // Get initial trip type from URL params if available
    const urlParams = new URLSearchParams(location.search);
    const initialTripType = urlParams?.get('type');
    if (initialTripType && ['one-way', 'round-trip', 'local', 'airport']?.includes(initialTripType)) {
      setTripType(initialTripType);
    }

    // Check if this is a package booking
    const packageData = location.state?.packageData;
    if (packageData && location.state?.tripType === 'package') {
      // Pre-fill form for package booking
      setTripType('package');
      // You could set other relevant fields based on package data
    }
  }, [location]);

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (userData) => {
    console.log('📝 handleAuthSuccess called with:', userData);
    
    setUser(userData);
    localStorage.setItem('cabBookerUser', JSON.stringify(userData));
    
    // Also store the token separately for API requests
    if (userData.token) {
      localStorage.setItem('auth_token', userData.token);
      console.log('✅ Token stored in auth_token');
    } else {
      console.log('⚠️ No token in userData');
    }
    
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/landing-page');
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!pickupLocation?.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }

    if (tripType !== 'local' && !dropLocation?.trim()) {
      newErrors.dropLocation = 'Drop location is required';
    }

    if (!pickupDate) {
      newErrors.pickupDate = 'Pickup date is required';
    }

    if (!pickupTime) {
      newErrors.pickupTime = 'Pickup time is required';
    }

    if (!selectedCar) {
      newErrors.selectedCar = 'Please select a vehicle';
    }

    // Round trip validation
    if (tripType === 'round-trip') {
      if (!returnDate) {
        newErrors.returnDate = 'Return date is required';
      }
      if (!returnTime) {
        newErrors.returnTime = 'Return time is required';
      }
      if (returnDate && pickupDate && new Date(returnDate) < new Date(pickupDate)) {
        newErrors.returnDate = 'Return date cannot be before pickup date';
      }
    }

    // Airport trip validation
    if (tripType === 'airport') {
      if (!flightNumber?.trim()) {
        newErrors.flightNumber = 'Flight number is required for airport trips';
      }
      if (!airline?.trim()) {
        newErrors.airline = 'Airline selection is required';
      }
    }

    // Package-specific validation
    if (tripType === 'package') {
      // Package bookings have different validation rules
      if (!pickupDate) {
        newErrors.pickupDate = 'Travel date is required';
      }
      if (!pickupTime) {
        newErrors.pickupTime = 'Preferred time is required';
      }
    } else {
      // ... keep existing trip validation ...
      if (!pickupLocation?.trim()) {
        newErrors.pickupLocation = 'Pickup location is required';
      }

      if (tripType !== 'local' && !dropLocation?.trim()) {
        newErrors.dropLocation = 'Drop location is required';
      }

      if (!pickupDate) {
        newErrors.pickupDate = 'Pickup date is required';
      }

      if (!pickupTime) {
        newErrors.pickupTime = 'Pickup time is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      handleAuthRequired();
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data for API
      const bookingData = {
        booking_type: tripType.replace('-', '_'), // Convert to API format (one-way -> one_way)
        package_id: tripType === 'package' ? location.state?.packageData?.id : undefined,
        vehicle_type: selectedCar?.vehicle_type,
        car_id: selectedCar?.id,
        scheduled_at: new Date(`${pickupDate} ${pickupTime}`).toISOString(),
        return_at: tripType === 'round-trip' ? new Date(`${returnDate} ${returnTime}`).toISOString() : undefined,
        pickup_location: pickupLocation,
        drop_location: tripType !== 'local' ? dropLocation : undefined,
        intermediate_stops: intermediateStops?.filter(stop => stop.trim()),
        special_requests: specialRequests,
        passenger_count: passengerCount,
        time_package: tripType === 'local' ? timePackage : undefined,
        flight_details: tripType === 'airport' ? {
          flight_number: flightNumber,
          airline: airline,
          is_arrival: isArrival
        } : undefined
      };

      // Call API to create booking
      const createdBooking = await ApiService.createBooking(bookingData);

      // Navigate to dashboard with success message
      navigate('/user-dashboard', { 
        state: { 
          message: 'Trip booked successfully!',
          bookingId: createdBooking?.id 
        }
      });

    } catch (error) {
      console.error('Booking failed:', error);
      const errorMessage = error?.message || 'Failed to book trip. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTripTypeChange = (newType) => {
    setTripType(newType);
    // Clear type-specific fields when changing trip type
    if (newType !== 'round-trip') {
      setReturnDate('');
      setReturnTime('');
    }
    if (newType !== 'airport') {
      setFlightNumber('');
      setAirline('');
      setIsArrival(true);
    }
    if (newType !== 'local') {
      setTimePackage('8hr');
    }
    if (newType === 'local') {
      setDropLocation('');
    }
  };

  const getTripTypeLabel = () => {
    const labels = {
      'one-way': 'One Way Trip',
      'round-trip': 'Round Trip',
      'local': 'Local Trip',
      'airport': 'Airport Transfer',
      'package': 'Package Booking'
    };
    return labels?.[tripType] || 'Trip Booking';
  };

  // Memoize filters to prevent unnecessary re-renders
  const vehicleFilters = useMemo(() => ({
    seating_capacity: passengerCount
  }), [passengerCount]);

  // Show package info if this is a package booking
  const packageData = location.state?.packageData;
  const isPackageBooking = tripType === 'package' && packageData;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onAuthRequired={handleAuthRequired}
        onLogout={handleLogout}
      />
      <TripStatusIndicator 
        activeTrip={activeTrip}
        onViewDetails={() => navigate('/trip-history')}
        onContactDriver={() => console.log('Contact driver')}
      />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="md:hidden"
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div>
              <h1 className="fluid-text-2xl font-bold text-foreground">
                {getTripTypeLabel()}
              </h1>
              <p className="text-muted-foreground">
                Fill in the details to book your ride
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} />
            <span>Secure Booking</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Package Info Banner */}
          {isPackageBooking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Icon name="Package" size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {packageData?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {packageData?.location} • {packageData?.duration} Days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Complete your booking details below to confirm your package tour.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ₹{packageData?.price?.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Trip Type Selection - Hide for package bookings */}
          {!isPackageBooking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TripTypeSelector
                selectedType={tripType}
                onTypeChange={handleTripTypeChange}
              />
            </motion.div>
          )}

          {/* Trip Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-foreground">
              {isPackageBooking ? 'Booking Details' : 'Trip Details'}
            </h3>
            
            {/* Location Inputs - Show different fields for package bookings */}
            {!isPackageBooking && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LocationInput
                  label="Pickup Location"
                  value={pickupLocation}
                  onChange={setPickupLocation}
                  placeholder="Enter pickup location"
                  error={errors?.pickupLocation}
                />
                
                {tripType !== 'local' && (
                  <LocationInput
                    label="Drop Location"
                    value={dropLocation}
                    onChange={setDropLocation}
                    placeholder="Enter drop location"
                    error={errors?.dropLocation}
                  />
                )}
              </div>
            )}

            {/* Date & Time Selection */}
            <DateTimeSelector
              tripType={isPackageBooking ? 'package' : tripType}
              pickupDate={pickupDate}
              pickupTime={pickupTime}
              returnDate={returnDate}
              returnTime={returnTime}
              onPickupDateChange={setPickupDate}
              onPickupTimeChange={setPickupTime}
              onReturnDateChange={setReturnDate}
              onReturnTimeChange={setReturnTime}
              errors={errors}
              packageData={packageData}
            />
          </motion.div>

          {/* Advanced Options Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Advanced Options</h3>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                iconName={showAdvancedOptions ? "ChevronUp" : "ChevronDown"}
                iconPosition="right"
                size="sm"
              >
                {showAdvancedOptions ? 'Hide' : 'Show'} Options
              </Button>
            </div>

            {/* Always show passenger count and vehicle type */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PassengerSelector
                passengerCount={passengerCount}
                onPassengerChange={setPassengerCount}
              />
              
              <VehicleSelector
                selectedCar={selectedCar}
                onCarChange={setSelectedCar}
                filters={vehicleFilters}
                validationError={errors?.selectedCar}
              />
            </div>

            {/* Expandable Advanced Options */}
            {showAdvancedOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Intermediate Stops - Hide for package bookings */}
                {!isPackageBooking && (
                  <IntermediateStops
                    stops={intermediateStops}
                    onStopsChange={setIntermediateStops}
                  />
                )}

                {/* Special Requests */}
                <SpecialRequestsInput
                  value={specialRequests}
                  onChange={setSpecialRequests}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Time Package for Local Trips */}
          {tripType === 'local' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TimePackageSelector
                selectedPackage={timePackage}
                onPackageChange={setTimePackage}
              />
            </motion.div>
          )}

          {/* Flight Details for Airport Trips */}
          {tripType === 'airport' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <FlightDetailsForm
                flightNumber={flightNumber}
                airline={airline}
                isArrival={isArrival}
                onFlightNumberChange={setFlightNumber}
                onAirlineChange={setAirline}
                onIsArrivalChange={setIsArrival}
                errors={errors}
              />
            </motion.div>
          )}

          {/* Fare Estimation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <FareEstimation
              tripType={tripType}
              passengerCount={passengerCount}
              selectedCar={selectedCar}
              timePackage={timePackage}
              intermediateStops={intermediateStops}
              packageData={packageData}
              pickupLocation={pickupLocation}
              dropLocation={dropLocation}
            />
          </motion.div>

          {/* Error Display */}
          {errors?.submit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-error/10 border border-error/20 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <p className="text-error text-sm">{errors?.submit}</p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="sticky bottom-4 md:static md:bottom-auto"
          >
            <Button
              type="submit"
              variant="default"
              size="lg"
              fullWidth
              loading={isSubmitting}
              iconName={isPackageBooking ? "Package" : "Car"}
              iconPosition="left"
              className="shadow-lg"
            >
              {isSubmitting 
                ? (isPackageBooking ? 'Booking Package...' : 'Booking Trip...') 
                : (isPackageBooking ? 'Book Package' : 'Book Now')
              }
            </Button>
          </motion.div>
        </form>
      </main>
      <MobileBottomNavigation 
        user={user} 
        onAuthRequired={handleAuthRequired}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default TripBookingForm;