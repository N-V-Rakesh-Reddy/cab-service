import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ApiService from '../../../utils/api';

const FareEstimation = ({
  tripType,
  passengerCount = 1,
  selectedCar = null,
  timePackage = '8hr',
  intermediateStops = [],
  packageData = null,
  className = '',
  pickupLocation,
  dropLocation
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fareData, setFareData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch fare estimate from API
  useEffect(() => {
    const fetchFareEstimate = async () => {
      // Don't fetch for package bookings
      if (tripType === 'package' && packageData) {
        return;
      }

      // Don't fetch if essential data is missing
      if (!tripType || !selectedCar) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = {
          booking_type: tripType.replace('-', '_'), // Convert to API format
          vehicle_type: selectedCar.vehicle_type,
          car_id: selectedCar.id,
          pickup_location: pickupLocation || 'Unknown',
          drop_location: dropLocation || 'Unknown',
          time_package: timePackage,
          passenger_count: passengerCount
        };

        const result = await ApiService.getFareEstimate(params);
        setFareData(result);
      } catch (err) {
        console.error('Failed to fetch fare estimate:', err);
        setError(err?.message || 'Failed to get fare estimate');
        // Fallback to local calculation
        setFareData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFareEstimate();
  }, [tripType, selectedCar, pickupLocation, dropLocation, timePackage, passengerCount, packageData]);

  const getVehicleMultiplier = (vehicle) => {
    const multipliers = {
      'hatchback': 1.0,
      'sedan': 1.2,
      'suv': 1.5,
      'luxury': 2.0
    };
    return multipliers?.[vehicle] || 1.2;
  };

  const calculateEstimatedFare = () => {
    // Package booking - return package price
    if (tripType === 'package' && packageData) {
      return {
        baseFare: packageData?.price * passengerCount,
        vehicleCharges: 0,
        stopCharges: 0,
        platformFee: 0,
        taxes: Math.round(packageData?.price * passengerCount * 0.05), // 5% tax
        total: Math.round(packageData?.price * passengerCount * 1.05)
      };
    }

    // Use API data if available
    if (fareData && !loading && !error) {
      const stopCharges = intermediateStops?.filter((stop) => stop?.trim())?.length * 30; // Additional stop charges
      return {
        baseFare: fareData.base_fare || 0,
        vehicleCharges: 0, // Already included in base fare from API
        stopCharges: stopCharges,
        platformFee: Math.round((fareData.base_fare || 0) * 0.05),
        taxes: Math.round(fareData.total_fare * 0.05) || 0,
        total: (fareData.total_fare || 0) + stopCharges
      };
    }

    // Fallback to local calculation
    let baseFare = 0;
    const vehicleMultiplier = selectedCar ? selectedCar.price_multiplier : 1.0;

    switch (tripType) {
      case 'one-way':
        baseFare = Math.round(150 * vehicleMultiplier);
        break;
      case 'round-trip':
        baseFare = Math.round(280 * vehicleMultiplier);
        break;
      case 'local':
        const timeMultipliers = { '4hr': 0.7, '8hr': 1.0, '12hr': 1.4 };
        baseFare = Math.round(400 * (timeMultipliers?.[timePackage] || 1) * vehicleMultiplier);
        break;
      case 'airport':
        baseFare = Math.round(200 * vehicleMultiplier);
        break;
      default:
        baseFare = Math.round(150 * vehicleMultiplier);
    }

    // Additional charges
    const stopCharges = intermediateStops?.filter((stop) => stop?.trim())?.length * 50;
    const platformFee = Math.round(baseFare * 0.05);
    const subtotal = baseFare + stopCharges + platformFee;
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + taxes;

    return {
      baseFare,
      vehicleCharges: 0,
      stopCharges,
      platformFee,
      taxes,
      total
    };
  };

  const fareBreakdown = calculateEstimatedFare();

  // Show message when no car is selected (except for package bookings)
  if (!selectedCar && tripType !== 'package') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground">Fare Estimation</h3>
        <div className="p-6 bg-card rounded-xl border border-border">
          <div className="text-center py-4">
            <Icon name="Car" size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              Please select a vehicle to see fare estimation
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">
        {tripType === 'package' ? 'Package Pricing' : 'Fare Estimation'}
      </h3>
      <div className="p-6 bg-card rounded-xl border border-border">
        {tripType === 'package' && packageData ?
        // Package pricing display
        <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Icon name="Package" size={16} className="text-primary" />
                <span className="text-foreground">Package Price</span>
              </div>
              <span className="font-medium text-foreground">
                ₹{packageData?.price?.toLocaleString()} × {passengerCount}
              </span>
            </div>
            {fareBreakdown?.taxes > 0 &&
          <div className="flex items-center justify-between py-2 border-t border-border">
                <span className="text-muted-foreground">Taxes & Fees</span>
                <span className="text-muted-foreground">₹{fareBreakdown?.taxes?.toLocaleString()}</span>
              </div>
          }
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-lg font-semibold text-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-primary">
                ₹{fareBreakdown?.total?.toLocaleString()}
              </span>
            </div>
          </div> :

        // Regular trip fare breakdown
        <div className="space-y-4">
            {/* Base Fare */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Icon name="Navigation" size={16} className="text-primary" />
                <span className="text-foreground">Base Fare</span>
              </div>
              <span className="font-medium text-foreground">₹{fareBreakdown?.baseFare?.toLocaleString()}</span>
            </div>
            {/* Vehicle Charges */}
            {fareBreakdown?.vehicleCharges > 0 &&
          <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Car" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Vehicle ({selectedCar ? `${selectedCar.make} ${selectedCar.model}` : 'Not selected'})</span>
                </div>
                <span className="text-muted-foreground">+₹{fareBreakdown?.vehicleCharges?.toLocaleString()}</span>
              </div>
          }
            {/* Stop Charges */}
            {fareBreakdown?.stopCharges > 0 &&
          <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Intermediate Stops ({intermediateStops?.filter((stop) => stop?.trim())?.length})
                  </span>
                </div>
                <span className="text-muted-foreground">+₹{fareBreakdown?.stopCharges?.toLocaleString()}</span>
              </div>
          }
            {/* Platform Fee */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">Platform Fee</span>
              </div>
              <span className="text-muted-foreground">₹{fareBreakdown?.platformFee?.toLocaleString()}</span>
            </div>
            {/* Taxes */}
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Taxes & GST</span>
              <span className="text-muted-foreground">₹{fareBreakdown?.taxes?.toLocaleString()}</span>
            </div>
            {/* Total */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-lg font-semibold text-foreground">Total Fare</span>
              <span className="text-2xl font-bold text-primary">
                ₹{fareBreakdown?.total?.toLocaleString()}
              </span>
            </div>
          </div>
        }
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Fare Estimation</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right">

          {isExpanded ? 'Hide' : 'Show'} Details
        </Button>
      </div>
      <div className="p-4 bg-card rounded-xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="IndianRupee" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Total</p>
              <p className="text-2xl font-bold text-primary">₹{fareBreakdown?.total}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">For {passengerCount} passenger{passengerCount > 1 ? 's' : ''}</p>
            <p className="text-xs text-muted-foreground">*Excluding tolls & parking</p>
          </div>
        </div>
        
        {isExpanded &&
        <div className="space-y-3 border-t border-border pt-4">
            <h4 className="font-medium text-card-foreground">Fare Breakdown</h4>
            <div className="space-y-2">
              {fareBreakdown?.breakdown?.map((item, index) =>
            <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item?.label}</span>
                  <span className="text-card-foreground">₹{item?.amount}</span>
                </div>
            )}
            </div>
            
            <div className="border-t border-border pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-card-foreground">Total Amount</span>
                <span className="text-primary">₹{fareBreakdown?.total}</span>
              </div>
            </div>
          </div>
        }
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Important Notes:</p>
              <ul className="space-y-1">
                <li>• Final fare may vary based on actual distance and time</li>
                <li>• Toll charges and parking fees are additional</li>
                <li>• Night charges (11 PM - 6 AM): +25%</li>
                <li>• Cancellation free up to 1 hour before pickup</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default FareEstimation;