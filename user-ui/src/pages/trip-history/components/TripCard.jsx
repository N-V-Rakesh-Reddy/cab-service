import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TripCard = ({ 
  trip, 
  onTrack = () => {}, 
  onCancel = () => {}, 
  onModify = () => {}, 
  onRate = () => {}, 
  onBookAgain = () => {},
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status) => {
    const configs = {
      'ongoing': {
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        label: 'In Progress'
      },
      'confirmed': {
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        label: 'Confirmed'
      },
      'completed': {
        color: 'text-success',
        bgColor: 'bg-success/10',
        label: 'Completed'
      },
      'cancelled': {
        color: 'text-error',
        bgColor: 'bg-error/10',
        label: 'Cancelled'
      },
      'scheduled': {
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        label: 'Scheduled'
      }
    };
    return configs?.[status] || configs?.['confirmed'];
  };

  const getTripTypeIcon = (type) => {
    const icons = {
      'one-way': 'ArrowRight',
      'round-trip': 'ArrowLeftRight',
      'local': 'MapPin',
      'airport': 'Plane'
    };
    return icons?.[type] || 'Car';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const statusConfig = getStatusConfig(trip?.status);

  const renderActions = () => {
    switch (trip?.category) {
      case 'current':
        return (
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onTrack(trip)}
              iconName="Navigation"
              iconPosition="left"
              className="flex-1"
            >
              Track
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(trip)}
              iconName="X"
              iconPosition="left"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        );
      case 'upcoming':
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModify(trip)}
              iconName="Edit"
              iconPosition="left"
              className="flex-1"
            >
              Modify
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(trip)}
              iconName="X"
              iconPosition="left"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        );
      case 'past':
        return (
          <div className="flex space-x-2">
            {!trip?.rated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRate(trip)}
                iconName="Star"
                iconPosition="left"
                className="flex-1"
              >
                Rate Trip
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => onBookAgain(trip)}
              iconName="RotateCcw"
              iconPosition="left"
              className="flex-1"
            >
              Book Again
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`glass-morphism bg-card/50 rounded-xl border border-border hover-lift ${className}`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-muted">
              <Icon name={getTripTypeIcon(trip?.type)} size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground text-sm">
                {trip?.from} → {trip?.to}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatDate(trip?.date)} • {formatTime(trip?.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.bgColor} ${statusConfig?.color}`}>
              {statusConfig?.label}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6"
            >
              <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
            </Button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Car" size={14} />
              <span>{trip?.vehicleType}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{trip?.duration}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-card-foreground">
              ₹{trip?.fare?.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted-foreground">
              ID: {trip?.bookingId}
            </p>
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border pt-4 mb-4"
            >
              <div className="space-y-3">
                {/* Driver Info */}
                {trip?.driver && (
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Icon name="User" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        {trip?.driver?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trip?.driver?.vehicle} • {trip?.driver?.rating}★ • {trip?.driver?.phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Distance</p>
                    <p className="font-medium text-card-foreground">{trip?.distance}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment</p>
                    <p className="font-medium text-card-foreground">{trip?.paymentMethod}</p>
                  </div>
                </div>

                {/* Intermediate Stops */}
                {trip?.stops && trip?.stops?.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Stops:</p>
                    <div className="space-y-1">
                      {trip?.stops?.map((stop, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Icon name="MapPin" size={12} className="text-muted-foreground" />
                          <span className="text-card-foreground">{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating */}
                {trip?.rating && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Your Rating:</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)]?.map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={14}
                          className={i < trip?.rating ? 'text-warning fill-current' : 'text-muted-foreground'}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        {renderActions()}
      </div>
    </motion.div>
  );
};

export default TripCard;