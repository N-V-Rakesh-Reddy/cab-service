import React from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FlightDetailsForm = ({ 
  flightNumber, 
  airline, 
  isArrival,
  onFlightNumberChange,
  onAirlineChange,
  onIsArrivalChange,
  errors = {},
  className = '' 
}) => {
  const airlines = [
    "Air India",
    "IndiGo",
    "SpiceJet",
    "Vistara",
    "GoAir",
    "AirAsia India",
    "Emirates",
    "Qatar Airways",
    "Singapore Airlines",
    "Other"
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">Flight Details</h3>
      <div className="space-y-4">
        <Checkbox
          label="This is an arrival flight (pickup from airport)"
          description="Uncheck if this is a departure flight (drop to airport)"
          checked={isArrival}
          onChange={(e) => onIsArrivalChange(e?.target?.checked)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Flight Number"
            type="text"
            placeholder="e.g., AI 131, 6E 2134"
            value={flightNumber}
            onChange={(e) => onFlightNumberChange(e?.target?.value)}
            error={errors?.flightNumber}
            description="Enter your flight number for tracking"
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Airline
            </label>
            <select
              value={airline}
              onChange={(e) => onAirlineChange(e?.target?.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select Airline</option>
              {airlines?.map((airlineName) => (
                <option key={airlineName} value={airlineName}>
                  {airlineName}
                </option>
              ))}
            </select>
            {errors?.airline && (
              <p className="text-sm text-error">{errors?.airline}</p>
            )}
          </div>
        </div>
        
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">
                {isArrival ? 'Arrival Flight Benefits:' : 'Departure Flight Benefits:'}
              </p>
              <ul className="space-y-1">
                {isArrival ? (
                  <>
                    <li>• Driver will track your flight status</li>
                    <li>• 45 minutes free waiting time</li>
                    <li>• Meet & greet service available</li>
                  </>
                ) : (
                  <>
                    <li>• Pickup time calculated based on traffic</li>
                    <li>• Flight check-in reminders</li>
                    <li>• Alternative route suggestions</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsForm;