import React from 'react';
import Input from '../../../components/ui/Input';

const DateTimeSelector = ({ 
  tripType, 
  pickupDate, 
  pickupTime, 
  returnDate, 
  returnTime,
  onPickupDateChange,
  onPickupTimeChange,
  onReturnDateChange,
  onReturnTimeChange,
  errors = {},
  className = '' 
}) => {
  const today = new Date()?.toISOString()?.split('T')?.[0];
  const currentTime = new Date()?.toTimeString()?.slice(0, 5);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date?.toISOString()?.split('T')?.[0];
  };

  const formatTimeForInput = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">Date & Time</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Pickup Date"
          type="date"
          value={formatDateForInput(pickupDate)}
          onChange={(e) => onPickupDateChange(e?.target?.value)}
          min={today}
          error={errors?.pickupDate}
          required
        />
        
        <Input
          label="Pickup Time"
          type="time"
          value={formatTimeForInput(pickupTime)}
          onChange={(e) => onPickupTimeChange(e?.target?.value)}
          error={errors?.pickupTime}
          required
        />
      </div>
      {tripType === 'round-trip' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Return Date"
            type="date"
            value={formatDateForInput(returnDate)}
            onChange={(e) => onReturnDateChange(e?.target?.value)}
            min={pickupDate || today}
            error={errors?.returnDate}
            required
          />
          
          <Input
            label="Return Time"
            type="time"
            value={formatTimeForInput(returnTime)}
            onChange={(e) => onReturnTimeChange(e?.target?.value)}
            error={errors?.returnTime}
            required
          />
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;