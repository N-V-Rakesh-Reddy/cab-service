import React from 'react';
import Icon from '../../../components/AppIcon';

const TimePackageSelector = ({ 
  selectedPackage, 
  onPackageChange, 
  className = '' 
}) => {
  const timePackages = [
    {
      id: '4hr',
      duration: '4 Hours',
      distance: '40 KM',
      price: '₹1,200',
      description: 'Perfect for short city tours',
      icon: 'Clock4'
    },
    {
      id: '8hr',
      duration: '8 Hours',
      distance: '80 KM',
      price: '₹2,000',
      description: 'Ideal for full day exploration',
      icon: 'Clock8',
      popular: true
    },
    {
      id: '12hr',
      duration: '12 Hours',
      distance: '120 KM',
      price: '₹2,800',
      description: 'Extended trips and outstation',
      icon: 'Clock12'
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">Select Time Package</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {timePackages?.map((pkg) => (
          <div
            key={pkg?.id}
            onClick={() => onPackageChange(pkg?.id)}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover-lift ${
              selectedPackage === pkg?.id
                ? 'border-primary bg-primary/10' :'border-border bg-card hover:border-primary/50'
            }`}
          >
            {pkg?.popular && (
              <div className="absolute -top-2 left-4 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Popular
              </div>
            )}
            
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-lg ${
                selectedPackage === pkg?.id ? 'bg-primary/20' : 'bg-muted'
              }`}>
                <Icon 
                  name="Clock" 
                  size={24} 
                  className={selectedPackage === pkg?.id ? 'text-primary' : 'text-muted-foreground'}
                />
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-card-foreground">{pkg?.duration}</h4>
                <p className="text-sm text-muted-foreground">{pkg?.distance} included</p>
                <p className="text-lg font-bold text-primary mt-2">{pkg?.price}</p>
                <p className="text-xs text-muted-foreground mt-1">{pkg?.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Package Details:</p>
            <ul className="space-y-1">
              <li>• Extra distance charged at ₹12/km</li>
              <li>• Extra time charged at ₹150/hour</li>
              <li>• Toll and parking charges extra</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimePackageSelector;