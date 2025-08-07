import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import ApiService from '../../../utils/api';

const PackageSelector = ({ 
  selectedPackage, 
  onPackageChange, 
  filters = {},
  validationError = null,
  className = '' 
}) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedFilters, setLastFetchedFilters] = useState(null);
  const [expandedPackages, setExpandedPackages] = useState(new Set());

  useEffect(() => {
    if (packages.length === 0 || shouldRefetch()) {
      fetchPackages();
    }
  }, [filters.vehicle_type, filters.location]);

  const shouldRefetch = () => {
    if (!lastFetchedFilters) return true;
    
    return (
      lastFetchedFilters.vehicle_type !== filters.vehicle_type ||
      lastFetchedFilters.location !== filters.location
    );
  };

  const fetchPackages = async () => {
    try {
      if (packages.length === 0) {
        setLoading(true);
      }
      setError(null);
      
      console.log('🔍 Fetching packages with filters:', filters);
      const response = await ApiService.getAvailablePackages(filters);
      console.log('📦 Package response:', response);
      
      if (response.success) {
        console.log('✅ Setting packages:', response.data);
        setPackages(response.data || []);
        setLastFetchedFilters({ ...filters });
      } else {
        console.error('❌ Package fetch failed:', response);
        throw new Error(response.error || 'Failed to fetch packages');
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = useCallback((pkg) => {
    onPackageChange(pkg);
  }, [onPackageChange]);

  const togglePackageExpansion = (packageId) => {
    setExpandedPackages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  };

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN')}`;
  };

  const formatDuration = (days) => {
    if (!days) return 'Duration not specified';
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  const getVehicleTypeIcon = (vehicleType) => {
    const iconMap = {
      'hatchback': 'Car',
      'sedan': 'Car',
      'suv': 'Truck',
      'luxury': 'Star'
    };
    return iconMap[vehicleType] || 'Car';
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground">Select Package</h3>
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Icon name="Loader" size={20} className="animate-spin mr-2" />
          Loading available packages...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground">Select Package</h3>
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <p className="text-error text-sm">
              Failed to load packages. Please try again.
            </p>
          </div>
          <button 
            onClick={fetchPackages}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground">Select Package</h3>
        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <Icon name="Package" size={24} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            No packages available with the current filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Select Package</h3>
        <div className="text-sm text-muted-foreground">
          {packages.length} package{packages.length !== 1 ? 's' : ''} available
        </div>
      </div>
      
      <div className="space-y-3">
        {packages.map((pkg) => {
          const isSelected = selectedPackage?.id === pkg.id;
          const isExpanded = expandedPackages.has(pkg.id);
          
          return (
            <div
              key={pkg.id}
              className={`
                border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover-lift
                ${isSelected 
                  ? 'border-primary bg-primary/5 shadow-card' 
                  : 'border-border bg-card hover:border-primary/50'
                }
              `}
              onClick={() => handlePackageSelect(pkg)}
            >
              {/* Package Header */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon name="MapPin" size={20} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`
                        font-semibold text-lg
                        ${isSelected ? 'text-primary' : 'text-foreground'}
                      `}>
                        {pkg.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {pkg.location}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <Icon name="Check" size={20} className="text-primary" />
                  )}
                </div>

                {/* Package Details */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground">
                      {formatDuration(pkg.duration_days)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Icon name={getVehicleTypeIcon(pkg.vehicle_type)} size={16} className="text-muted-foreground" />
                    <span className="text-sm text-foreground capitalize">
                      {pkg.vehicle_type || 'Standard'}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-foreground">
                    {pkg.price ? formatPrice(pkg.price) : 'Price on request'}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePackageExpansion(pkg.id);
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    {isExpanded ? 'Show less' : 'View details'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border bg-muted/20 animate-in slide-in-from-top-2 duration-200">
                  {/* Description */}
                  {pkg.description && (
                    <div className="py-3">
                      <h5 className="text-sm font-medium text-foreground mb-2">Description</h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {pkg.tags && pkg.tags.length > 0 && (
                    <div className="py-3 border-t border-border/50">
                      <h5 className="text-sm font-medium text-foreground mb-2">Highlights</h5>
                      <div className="flex flex-wrap gap-2">
                        {pkg.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Segments/Itinerary */}
                  {pkg.segments && pkg.segments.length > 0 && (
                    <div className="py-3 border-t border-border/50">
                      <h5 className="text-sm font-medium text-foreground mb-2">Itinerary</h5>
                      <div className="space-y-2">
                        {pkg.segments
                          .sort((a, b) => a.order - b.order)
                          .map((segment, index) => (
                            <div key={segment.id} className="flex items-center space-x-3">
                              <div className={`
                                w-2 h-2 rounded-full
                                ${segment.type === 'pickup' 
                                  ? 'bg-green-500' 
                                  : segment.type === 'drop'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                                }
                              `} />
                              <span className="text-sm text-muted-foreground">
                                {segment.location_name}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
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
            <p className="font-medium text-foreground mb-1">Package Booking:</p>
            <ul className="space-y-1">
              <li>• All packages include vehicle and driver</li>
              <li>• Prices are for the complete package duration</li>
              <li>• Accommodation and meals may be included (check details)</li>
              <li>• Customization available upon request</li>
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

export default React.memo(PackageSelector);