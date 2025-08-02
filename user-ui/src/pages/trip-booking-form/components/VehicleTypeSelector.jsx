import React from 'react';
import Icon from '../../../components/AppIcon';

const VehicleTypeSelector = ({ 
  selectedVehicle, 
  onVehicleChange, 
  className = '' 
}) => {
  const vehicleTypes = [
    {
      id: 'hatchback',
      name: 'Hatchback',
      description: 'Compact & economical',
      icon: 'Car',
      capacity: '4 seats',
      examples: 'Swift, i10, Alto',
      priceMultiplier: 1.0
    },
    {
      id: 'sedan',
      name: 'Sedan',
      description: 'Comfortable & spacious',
      icon: 'Car',
      capacity: '4 seats',
      examples: 'Dzire, Amaze, City',
      priceMultiplier: 1.2
    },
    {
      id: 'suv',
      name: 'SUV/MUV',
      description: 'Premium & roomy',
      icon: 'Truck',
      capacity: '6-7 seats',
      examples: 'Ertiga, Innova, XUV',
      priceMultiplier: 1.5
    },
    {
      id: 'luxury',
      name: 'Luxury',
      description: 'Premium experience',
      icon: 'Star',
      capacity: '4 seats',
      examples: 'Camry, BMW, Audi',
      priceMultiplier: 2.0
    }
  ];

  const handleVehicleSelect = (vehicleId) => {
    onVehicleChange(vehicleId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">Vehicle Type</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {vehicleTypes?.map((vehicle) => (
          <div
            key={vehicle?.id}
            className={`
              p-4 rounded-xl border cursor-pointer transition-all duration-200 hover-lift
              ${selectedVehicle === vehicle?.id 
                ? 'border-primary bg-primary/5 shadow-card' 
                : 'border-border bg-card hover:border-primary/50'
              }
            `}
            onClick={() => handleVehicleSelect(vehicle?.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                p-2 rounded-lg
                ${selectedVehicle === vehicle?.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                <Icon name={vehicle?.icon} size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`
                    font-medium
                    ${selectedVehicle === vehicle?.id 
                      ? 'text-primary' :'text-foreground'
                    }
                  `}>
                    {vehicle?.name}
                  </h4>
                  {selectedVehicle === vehicle?.id && (
                    <Icon name="Check" size={16} className="text-primary" />
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {vehicle?.description}
                </p>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{vehicle?.capacity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Tag" size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{vehicle?.examples}</span>
                  </div>
                  {vehicle?.priceMultiplier !== 1.0 && (
                    <div className="flex items-center space-x-2">
                      <Icon name="TrendingUp" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {vehicle?.priceMultiplier > 1.0 
                          ? `+${Math.round((vehicle?.priceMultiplier - 1) * 100)}% base fare`
                          : 'Base fare'
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Vehicle Selection:</p>
            <ul className="space-y-1">
              <li>• Vehicle type affects the final fare</li>
              <li>• Subject to availability in your area</li>
              <li>• Driver will confirm the exact vehicle model</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleTypeSelector;