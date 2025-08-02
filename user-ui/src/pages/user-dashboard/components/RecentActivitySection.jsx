import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivitySection = ({ recentTrips, onRateTrip }) => {
  const getStatusConfig = (status) => {
    const configs = {
      'completed': {
        icon: 'CheckCircle',
        color: 'text-success',
        bgColor: 'bg-success/10'
      },
      'cancelled': {
        icon: 'XCircle',
        color: 'text-error',
        bgColor: 'bg-error/10'
      },
      'ongoing': {
        icon: 'Car',
        color: 'text-primary',
        bgColor: 'bg-primary/10'
      }
    };
    return configs?.[status] || configs?.['completed'];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!recentTrips || recentTrips?.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="fluid-text-xl font-semibold text-card-foreground">
            Recent Activity
          </h2>
        </div>
        <div className="glass-morphism bg-card/95 rounded-xl border border-border p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Icon name="Clock" size={24} className="text-muted-foreground" />
            </div>
          </div>
          <h3 className="font-semibold text-card-foreground mb-2">
            No Recent Activity
          </h3>
          <p className="text-muted-foreground mb-4">
            Your trip history will appear here once you start booking rides.
          </p>
          <Link to="/trip-booking-form">
            <Button variant="outline" iconName="Plus" iconPosition="left">
              Book Your First Trip
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="fluid-text-xl font-semibold text-card-foreground">
          Recent Activity
        </h2>
        <Link to="/trip-history">
          <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
            View All
          </Button>
        </Link>
      </div>
      <div className="space-y-3">
        {recentTrips?.slice(0, 3)?.map((trip) => {
          const statusConfig = getStatusConfig(trip?.status);
          
          return (
            <div
              key={trip?.id}
              className="glass-morphism bg-card/95 rounded-lg border border-border p-4 hover-lift transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${statusConfig?.bgColor} mt-1`}>
                    <Icon name={statusConfig?.icon} size={16} className={statusConfig?.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-card-foreground">
                        {trip?.pickup} → {trip?.destination}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {trip?.distance} km
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{formatDate(trip?.date)}</span>
                      <span>{formatTime(trip?.date)}</span>
                      <span>₹{trip?.fare}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {trip?.status === 'completed' && !trip?.rated && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRateTrip(trip?.id)}
                      iconName="Star"
                      iconPosition="left"
                    >
                      Rate
                    </Button>
                  )}
                  {trip?.status === 'completed' && trip?.rated && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Star" size={14} className="text-warning fill-current" />
                      <span className="text-sm text-muted-foreground">
                        {trip?.rating}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreVertical"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivitySection;