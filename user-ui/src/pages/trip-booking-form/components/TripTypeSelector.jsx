import React from 'react';
import Icon from '../../../components/AppIcon';

const TripTypeSelector = ({ selectedType, onTypeChange, className = '' }) => {
  const tripTypes = [
    {
      id: 'one-way',
      label: 'One Way',
      icon: 'ArrowRight',
      description: 'Single destination trip'
    },
    {
      id: 'round-trip',
      label: 'Round Trip',
      icon: 'ArrowLeftRight',
      description: 'Return to pickup location'
    },
    {
      id: 'local',
      label: 'Local',
      icon: 'MapPin',
      description: 'City tours & local trips'
    },
    {
      id: 'airport',
      label: 'Airport',
      icon: 'Plane',
      description: 'Airport transfers'
    },
    {
      id: 'package',
      label: 'Package',
      icon: 'Package',
      description: 'Multi-day tour packages'
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">Select Trip Type</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tripTypes?.map((type) => (
          <button
            key={type?.id}
            type="button"
            onClick={() => onTypeChange(type?.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 hover-lift ${
              selectedType === type?.id
                ? 'border-primary bg-primary/10 text-primary' :'border-border bg-card hover:border-primary/50 text-card-foreground'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`p-2 rounded-lg ${
                selectedType === type?.id ? 'bg-primary/20' : 'bg-muted'
              }`}>
                <Icon 
                  name={type?.icon} 
                  size={20} 
                  className={selectedType === type?.id ? 'text-primary' : 'text-muted-foreground'}
                />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{type?.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{type?.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TripTypeSelector;