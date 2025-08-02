import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import LocationInput from './LocationInput';

const IntermediateStops = ({ 
  stops, 
  onStopsChange, 
  className = '' 
}) => {
  const addStop = () => {
    if (stops?.length < 3) {
      onStopsChange([...stops, '']);
    }
  };

  const removeStop = (index) => {
    const newStops = stops?.filter((_, i) => i !== index);
    onStopsChange(newStops);
  };

  const updateStop = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    onStopsChange(newStops);
  };

  const moveStop = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= stops?.length) return;
    
    const newStops = [...stops];
    const [movedStop] = newStops?.splice(fromIndex, 1);
    newStops?.splice(toIndex, 0, movedStop);
    onStopsChange(newStops);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Intermediate Stops</h3>
        <span className="text-sm text-muted-foreground">
          {stops?.length}/3 stops added
        </span>
      </div>
      {stops?.length === 0 && (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-muted rounded-full">
              <Icon name="MapPin" size={24} className="text-muted-foreground" />
            </div>
          </div>
          <p className="text-muted-foreground mb-4">No intermediate stops added</p>
          <Button
            variant="outline"
            onClick={addStop}
            iconName="Plus"
            iconPosition="left"
          >
            Add Stop
          </Button>
        </div>
      )}
      {stops?.length > 0 && (
        <div className="space-y-3">
          {stops?.map((stop, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-card rounded-xl border border-border">
              <div className="flex flex-col items-center space-y-2 mt-8">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {index + 1}
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveStop(index, index - 1)}
                    disabled={index === 0}
                    className="h-6 w-6"
                  >
                    <Icon name="ChevronUp" size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveStop(index, index + 1)}
                    disabled={index === stops?.length - 1}
                    className="h-6 w-6"
                  >
                    <Icon name="ChevronDown" size={12} />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <LocationInput
                  label={`Stop ${index + 1}`}
                  value={stop}
                  onChange={(value) => updateStop(index, value)}
                  placeholder="Enter stop location"
                  showRecent={false}
                />
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeStop(index)}
                className="mt-8 text-error hover:text-error hover:bg-error/10"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          ))}
          
          {stops?.length < 3 && (
            <Button
              variant="outline"
              onClick={addStop}
              iconName="Plus"
              iconPosition="left"
              fullWidth
            >
              Add Another Stop
            </Button>
          )}
        </div>
      )}
      {stops?.length > 0 && (
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Stop Charges:</p>
              <ul className="space-y-1">
                <li>• ₹50 per stop (waiting time up to 10 minutes)</li>
                <li>• Additional waiting charged at ₹2/minute</li>
                <li>• Stops will be visited in the order shown</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntermediateStops;