import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const TripStatusIndicator = ({ 
  activeTrip = null, 
  onViewDetails = () => {}, 
  onContactDriver = () => {},
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!activeTrip) return null;

  const getStatusConfig = (status) => {
    const configs = {
      'searching': {
        icon: 'Search',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        label: 'Finding Driver',
        description: 'Searching for nearby drivers...'
      },
      'confirmed': {
        icon: 'CheckCircle',
        color: 'text-success',
        bgColor: 'bg-success/10',
        label: 'Driver Confirmed',
        description: 'Driver is on the way'
      },
      'arriving': {
        icon: 'Navigation',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        label: 'Driver Arriving',
        description: 'Driver will arrive soon'
      },
      'pickup': {
        icon: 'MapPin',
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        label: 'At Pickup Location',
        description: 'Driver has arrived'
      },
      'ongoing': {
        icon: 'Car',
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        label: 'Trip in Progress',
        description: 'Enjoy your ride'
      },
      'completed': {
        icon: 'Flag',
        color: 'text-success',
        bgColor: 'bg-success/10',
        label: 'Trip Completed',
        description: 'Thank you for riding with us'
      }
    };

    return configs?.[status] || configs?.['searching'];
  };

  const statusConfig = getStatusConfig(activeTrip?.status);
  const eta = activeTrip?.eta ? new Date(activeTrip.eta) : null;
  const timeRemaining = eta ? Math.max(0, Math.ceil((eta - currentTime) / 1000 / 60)) : null;

  return (
    <>
      {/* Desktop Indicator */}
      <div className={`hidden md:block fixed top-20 right-6 z-400 ${className}`}>
        <div className="glass-morphism bg-card/95 rounded-xl border border-border shadow-card p-4 w-80">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${statusConfig?.bgColor}`}>
                <Icon name={statusConfig?.icon} size={20} className={statusConfig?.color} />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground text-sm">
                  {statusConfig?.label}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {statusConfig?.description}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6"
            >
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
            </Button>
          </div>

          {timeRemaining !== null && (
            <div className="flex items-center space-x-2 mb-3 text-xs">
              <Icon name="Clock" size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                ETA: {timeRemaining} min{timeRemaining !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {isExpanded && (
            <div className="space-y-3 border-t border-border pt-3">
              {activeTrip?.driver && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="User" size={14} />
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onContactDriver}
                    iconName="Phone"
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={onViewDetails}
                  iconName="Eye"
                  iconPosition="left"
                >
                  View Details
                </Button>
                {activeTrip?.trackingUrl && (
                  <Button
                    variant="default"
                    size="sm"
                    fullWidth
                    onClick={() => window.open(activeTrip?.trackingUrl, '_blank')}
                    iconName="Navigation"
                    iconPosition="left"
                  >
                    Track Live
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Indicator */}
      <div className={`md:hidden fixed top-16 left-4 right-4 z-400 ${className}`}>
        <div 
          className="glass-morphism bg-card/95 rounded-lg border border-border shadow-card p-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${statusConfig?.bgColor}`}>
                <Icon name={statusConfig?.icon} size={18} className={statusConfig?.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground text-sm">
                  {statusConfig?.label}
                </h3>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-muted-foreground">
                    {statusConfig?.description}
                  </p>
                  {timeRemaining !== null && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {timeRemaining} min
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Icon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-3 border-t border-border pt-3">
              {activeTrip?.driver && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="User" size={14} />
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e?.stopPropagation();
                      onContactDriver();
                    }}
                    iconName="Phone"
                  />
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={(e) => {
                    e?.stopPropagation();
                    onViewDetails();
                  }}
                  iconName="Eye"
                  iconPosition="left"
                >
                  Details
                </Button>
                {activeTrip?.trackingUrl && (
                  <Button
                    variant="default"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e?.stopPropagation();
                      window.open(activeTrip?.trackingUrl, '_blank');
                    }}
                    iconName="Navigation"
                    iconPosition="left"
                  >
                    Track
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TripStatusIndicator;