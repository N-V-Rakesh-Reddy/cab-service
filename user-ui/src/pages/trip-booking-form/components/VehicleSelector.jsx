import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import ApiService from '../../../utils/api';

const VehicleSelector = ({ 
  selectedCar, 
  onCarChange, 
  filters = {},
  validationError = null,
  className = '' 
}) => {
  const [cars, setCars] = useState([]);
  const [groupedCars, setGroupedCars] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTypes, setExpandedTypes] = useState(new Set(['sedan'])); // Default expand sedan
  const [lastFetchedFilters, setLastFetchedFilters] = useState(null);
  const [expandedFeatures, setExpandedFeatures] = useState(new Set()); // Track which cars have expanded features

  // Vehicle type metadata for display
  const vehicleTypeInfo = {
    hatchback: {
      name: 'Hatchback',
      description: 'Compact & economical',
      icon: 'Car'
    },
    sedan: {
      name: 'Sedan',
      description: 'Comfortable & spacious',
      icon: 'Car'
    },
    suv: {
      name: 'SUV/MUV',
      description: 'Premium & roomy',
      icon: 'Truck'
    },
    luxury: {
      name: 'Luxury',
      description: 'Premium experience',
      icon: 'Star'
    }
  };

  useEffect(() => {
    // Only fetch if we don't have cars loaded or if filters have actually changed
    if (cars.length === 0 || shouldRefetch()) {
      fetchCars();
    }
  }, [filters.vehicle_type, filters.location_city, filters.seating_capacity]);

  const shouldRefetch = () => {
    // Check if filters have actually changed
    if (!lastFetchedFilters) return true;
    
    return (
      lastFetchedFilters.vehicle_type !== filters.vehicle_type ||
      lastFetchedFilters.location_city !== filters.location_city ||
      lastFetchedFilters.seating_capacity !== filters.seating_capacity
    );
  };

  const fetchCars = async () => {
    try {
      // Don't show loading if we already have cars (prevents flicker)
      if (cars.length === 0) {
        setLoading(true);
      }
      setError(null);
      
      const response = await ApiService.getAvailableCars(filters);
      
      if (response.success) {
        setCars(response.data.cars || []);
        setGroupedCars(response.data.groupedByType || {});
        // Store the filters we just fetched with
        setLastFetchedFilters({ ...filters });
      } else {
        throw new Error(response.error || 'Failed to fetch cars');
      }
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTypeExpansion = (vehicleType) => {
    setExpandedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(vehicleType)) {
        newSet.delete(vehicleType);
      } else {
        newSet.add(vehicleType);
      }
      return newSet;
    });
  };

  const handleCarSelect = useCallback((car) => {
    onCarChange(car);
  }, [onCarChange]);

  const toggleFeatureExpansion = (carId) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(carId)) {
        newSet.delete(carId);
      } else {
        newSet.add(carId);
      }
      return newSet;
    });
  };

  const formatPrice = (basePrice, multiplier) => {
    const price = basePrice * multiplier;
    return `₹${price.toFixed(0)}/km`;
  };

  const getCarDisplayName = (car) => {
    return `${car.make} ${car.model} ${car.year ? `(${car.year})` : ''}`;
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground">Select Vehicle</h3>
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Icon name="Loader" size={20} className="animate-spin mr-2" />
          Loading available vehicles...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground">Select Vehicle</h3>
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-error text-sm">
              Failed to load vehicles. Please try again.
            </p>
          </div>
          <button 
            onClick={fetchCars}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground">Select Vehicle</h3>
        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <Icon name="Car" size={24} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            No vehicles available with the current filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Select Vehicle</h3>
        <div className="text-sm text-muted-foreground">
          {cars.length} vehicle{cars.length !== 1 ? 's' : ''} available
        </div>
      </div>
      
      <div className="space-y-3">
        {Object.entries(groupedCars).map(([vehicleType, typeCars]) => {
          const typeInfo = vehicleTypeInfo[vehicleType];
          const isExpanded = expandedTypes.has(vehicleType);
          
          return (
            <div key={vehicleType} className="border border-border rounded-xl overflow-hidden">
              {/* Vehicle Type Header */}
              <div 
                className="p-4 bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleTypeExpansion(vehicleType)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon name={typeInfo?.icon || 'Car'} size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">
                        {typeInfo?.name || vehicleType}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {typeInfo?.description || ''} • {typeCars.length} available
                      </p>
                    </div>
                  </div>
                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                </div>
              </div>

              {/* Cars List */}
              {isExpanded && (
                <div className="p-2 space-y-2 bg-card animate-in slide-in-from-top-2 duration-200">
                  {typeCars.map((car) => (
                    <div
                      key={car.id}
                      className={`
                        p-3 rounded-lg border cursor-pointer transition-all duration-200 hover-lift
                        ${selectedCar?.id === car.id 
                          ? 'border-primary bg-primary/5 shadow-card' 
                          : 'border-border bg-card hover:border-primary/50'
                        }
                      `}
                      onClick={() => handleCarSelect(car)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className={`
                              font-medium text-sm
                              ${selectedCar?.id === car.id 
                                ? 'text-primary' 
                                : 'text-foreground'
                              }
                            `}>
                              {getCarDisplayName(car)}
                            </h5>
                            {selectedCar?.id === car.id && (
                              <Icon name="Check" size={14} className="text-primary" />
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Icon name="Users" size={12} />
                              <span>{car.seating_capacity} seats</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Icon name="Fuel" size={12} />
                              <span className="capitalize">{car.fuel_type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Icon name="Settings" size={12} />
                              <span className="capitalize">{car.transmission}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Icon name="MapPin" size={12} />
                              <span>{car.location_area}</span>
                            </div>
                          </div>

                          {/* Features */}
                          {car.features && car.features.length > 0 && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1 items-center">
                                {/* Show first 3 features or all if expanded */}
                                {(expandedFeatures.has(car.id) ? car.features : car.features.slice(0, 3))
                                  .map((feature, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-muted/50 text-xs text-muted-foreground rounded"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                
                                {/* Show +X more button if there are more than 3 features */}
                                {car.features.length > 3 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent car selection when clicking the button
                                      toggleFeatureExpansion(car.id);
                                    }}
                                    className="px-2 py-1 bg-primary/10 text-xs text-primary rounded hover:bg-primary/20 transition-colors"
                                  >
                                    {expandedFeatures.has(car.id) 
                                      ? 'Show less' 
                                      : `+${car.features.length - 3} more`
                                    }
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Pricing */}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm font-medium text-foreground">
                              {formatPrice(car.base_price_per_km, car.price_multiplier)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              License: {car.license_plate}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Info Section */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Vehicle Selection:</p>
            <ul className="space-y-1">
              <li>• Choose from real available vehicles</li>
              <li>• Prices are per kilometer based on vehicle</li>
              <li>• Vehicle availability is updated in real-time</li>
              <li>• Driver assignment happens after booking confirmation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-error text-sm">{validationError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(VehicleSelector);