import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TripModal = ({ 
  isOpen = false, 
  onClose = () => {}, 
  trip = null,
  type = 'details', // 'details', 'rate', 'cancel'
  onConfirm = () => {},
  className = '' 
}) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset form when modal closes
      setRating(0);
      setFeedback('');
      setCancelReason('');
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (type === 'rate') {
        onConfirm({ rating, feedback });
      } else if (type === 'cancel') {
        onConfirm({ reason: cancelReason });
      } else {
        onConfirm();
      }
      
      onClose();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'rate':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Rate Your Trip
              </h3>
              <p className="text-muted-foreground">
                How was your experience with {trip?.driver?.name}?
              </p>
            </div>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5]?.map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Icon
                    name="Star"
                    size={32}
                    className={star <= rating ? 'text-warning fill-current' : 'text-muted-foreground'}
                  />
                </button>
              ))}
            </div>
            <Input
              label="Feedback (Optional)"
              type="text"
              placeholder="Share your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e?.target?.value)}
              className="mb-4"
            />
            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={onClose}
                disabled={isLoading}
              >
                Skip
              </Button>
              <Button
                variant="default"
                fullWidth
                onClick={handleConfirm}
                loading={isLoading}
                disabled={rating === 0}
                iconName="Star"
                iconPosition="left"
              >
                Submit Rating
              </Button>
            </div>
          </div>
        );

      case 'cancel':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 mx-auto mb-4">
                <Icon name="AlertTriangle" size={24} className="text-error" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Cancel Trip
              </h3>
              <p className="text-muted-foreground">
                Are you sure you want to cancel this trip?
              </p>
            </div>
            <Input
              label="Reason for Cancellation"
              type="text"
              placeholder="Please tell us why you're cancelling..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e?.target?.value)}
              required
              className="mb-4"
            />
            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={onClose}
                disabled={isLoading}
              >
                Keep Trip
              </Button>
              <Button
                variant="destructive"
                fullWidth
                onClick={handleConfirm}
                loading={isLoading}
                disabled={!cancelReason?.trim()}
                iconName="X"
                iconPosition="left"
              >
                Cancel Trip
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Trip Details
              </h3>
              <p className="text-muted-foreground">
                Booking ID: {trip?.bookingId}
              </p>
            </div>
            {trip && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">From</p>
                    <p className="font-medium text-card-foreground">{trip?.from}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">To</p>
                    <p className="font-medium text-card-foreground">{trip?.to}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date & Time</p>
                    <p className="font-medium text-card-foreground">
                      {new Date(trip.date)?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fare</p>
                    <p className="font-medium text-card-foreground">
                      ₹{trip?.fare?.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {trip?.driver && (
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Driver Details</p>
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Icon name="User" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{trip?.driver?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {trip?.driver?.vehicle} • {trip?.driver?.rating}★
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <Button
              variant="default"
              fullWidth
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className={`fixed inset-0 z-300 flex items-center justify-center p-4 glass-morphism bg-black/50 ${className}`}
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md glass-morphism bg-card/95 rounded-2xl border border-border shadow-modal"
        >
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Icon name="Car" size={16} color="white" />
              </div>
              <span className="font-semibold text-card-foreground">CabBooker</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-card-foreground"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="p-6">
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TripModal;