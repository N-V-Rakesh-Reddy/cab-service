import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PassengerSelector = ({ 
  passengerCount, 
  onPassengerChange, 
  className = '' 
}) => {
  const handleIncrement = () => {
    if (passengerCount < 8) {
      onPassengerChange(passengerCount + 1);
    }
  };

  const handleDecrement = () => {
    if (passengerCount > 1) {
      onPassengerChange(passengerCount - 1);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">Passengers</h3>
      
      <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="Users" size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-card-foreground">Number of Passengers</p>
            <p className="text-sm text-muted-foreground">Maximum 8 passengers allowed</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={passengerCount <= 1}
            className="h-10 w-10"
          >
            <Icon name="Minus" size={16} />
          </Button>
          
          <div className="flex items-center justify-center w-12 h-10 bg-muted rounded-lg">
            <span className="font-semibold text-foreground">{passengerCount}</span>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            disabled={passengerCount >= 8}
            className="h-10 w-10"
          >
            <Icon name="Plus" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PassengerSelector;