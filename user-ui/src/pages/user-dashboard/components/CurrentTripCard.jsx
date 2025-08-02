import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CurrentTripCard = ({ activeTrip, onContactDriver, onTrackTrip, onCancelTrip }) => {
  if (!activeTrip) {
    return (
      <div className="glass-morphism bg-card/95 rounded-xl border border-border p-6 mb-6">
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Icon name="Car" size={32} className="text-muted-foreground" />
            </div>
          </div>
          <h3 className="fluid-text-lg font-semibold text-card-foreground mb-2">
            No Active Trips
          </h3>
          <p className="text-muted-foreground mb-6">
            Ready to book your next ride?
          </p>
          <Link to="/trip-booking-form">
            <Button variant="default" iconName="Plus" iconPosition="left">
              Book New Trip
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      'confirmed': {
        icon: 'CheckCircle',
        color: 'text-success',
        bgColor: 'bg-success/10',
        label: 'Confirmed'
      },
      'ongoing': {
        icon: 'Car',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        label: 'In Progress'
      },
      'arriving': {
        icon: 'Navigation',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        label: 'Driver Arriving'
      }
    };
    return configs?.[status] || configs?.['confirmed'];
  };

  const statusConfig = getStatusConfig(activeTrip?.status);

  return (
    <div className="glass-morphism bg-card/95 rounded-xl border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="fluid-text-xl font-semibold text-card-foreground">
          Current Trip
        </h2>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusConfig?.bgColor}`}>
          <Icon name={statusConfig?.icon} size={16} className={statusConfig?.color} />
          <span className={`text-sm font-medium ${statusConfig?.color}`}>
            {statusConfig?.label}
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {/* Route Information */}
        <div className="flex items-start space-x-3">
          <div className="flex flex-col items-center mt-1">
            <div className="h-3 w-3 rounded-full bg-success"></div>
            <div className="h-8 w-0.5 bg-border"></div>
            <div className="h-3 w-3 rounded-full bg-error"></div>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-sm font-medium text-card-foreground">
                {activeTrip?.pickup}
              </p>
              <p className="text-xs text-muted-foreground">Pickup Location</p>
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">
                {activeTrip?.destination}
              </p>
              <p className="text-xs text-muted-foreground">Destination</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-card-foreground">
              ₹{activeTrip?.fare}
            </p>
            <p className="text-xs text-muted-foreground">
              {activeTrip?.distance} km
            </p>
          </div>
        </div>

        {/* Driver Information */}
        {activeTrip?.driver && (
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Icon name="User" size={20} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  {activeTrip?.driver?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activeTrip?.driver?.vehicle} • {activeTrip?.driver?.rating}★
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-card-foreground">
                {activeTrip?.driver?.plateNumber}
              </p>
              <p className="text-xs text-muted-foreground">
                ETA: {activeTrip?.eta} min
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            fullWidth
            onClick={onTrackTrip}
            iconName="Navigation"
            iconPosition="left"
          >
            Track Live
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={onContactDriver}
            iconName="Phone"
            iconPosition="left"
          >
            Contact Driver
          </Button>
          <Button
            variant="destructive"
            fullWidth
            onClick={onCancelTrip}
            iconName="X"
            iconPosition="left"
          >
            Cancel Trip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurrentTripCard;