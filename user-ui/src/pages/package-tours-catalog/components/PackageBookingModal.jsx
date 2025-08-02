import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PackageBookingModal = ({ 
  isOpen, 
  onClose, 
  package: pkg, 
  onBookNow = () => {} 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!pkg) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(price);
  };

  const getDurationText = (days) => {
    if (days === 1) return '1 Day';
    return `${days} Days`;
  };

  const handleBookNow = () => {
    onBookNow(pkg);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'meals': return 'Utensils';
      case 'accommodation': return 'Bed';
      case 'transport': return 'Car';
      case 'guide': return 'User';
      case 'activities': return 'Activity';
      default: return 'Check';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleBackdropClick}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-background rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-card/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name="Package" size={20} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Package Details</h2>
                  <p className="text-sm text-muted-foreground">Review before booking</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Left Column - Image and Basic Info */}
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="relative h-64 lg:h-80 overflow-hidden rounded-xl">
                    <Image
                      src={pkg?.image}
                      alt={pkg?.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                    />
                    
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                        <Icon name="Image" size={32} className="text-muted-foreground" />
                      </div>
                    )}

                    {/* Overlay Info */}
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                      <div className="flex flex-col space-y-2">
                        {pkg?.isPopular && (
                          <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                            Popular
                          </span>
                        )}
                        {pkg?.discount && (
                          <span className="px-3 py-1 bg-success text-success-foreground text-sm font-medium rounded-full">
                            {pkg?.discount}% OFF
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 glass-morphism bg-black/30 px-3 py-1 rounded-full">
                        <Icon name="Star" size={14} className="text-yellow-400 fill-current" />
                        <span className="text-white text-sm font-medium">{pkg?.rating}</span>
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className="flex items-center space-x-1 glass-morphism bg-black/30 px-3 py-1 rounded-full">
                        <Icon name="Clock" size={14} className="text-white" />
                        <span className="text-white text-sm font-medium">
                          {getDurationText(pkg?.duration)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Title and Location */}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {pkg?.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Icon name="MapPin" size={16} />
                      <span className="text-base">{pkg?.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">About This Package</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {pkg?.description}
                    </p>
                  </div>
                </div>

                {/* Right Column - Details and Booking */}
                <div className="space-y-6">
                  {/* Pricing */}
                  <div className="p-6 bg-card rounded-xl border border-border">
                    <div className="flex items-baseline space-x-3 mb-2">
                      <span className="text-3xl font-bold text-foreground">
                        {formatPrice(pkg?.price)}
                      </span>
                      {pkg?.originalPrice && pkg?.originalPrice > pkg?.price && (
                        <span className="text-lg text-muted-foreground line-through">
                          {formatPrice(pkg?.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">per person</p>
                    {pkg?.discount && (
                      <p className="text-sm text-success font-medium mt-2">
                        You save {formatPrice(pkg?.originalPrice - pkg?.price)} with this package!
                      </p>
                    )}
                  </div>

                  {/* Package Highlights */}
                  {pkg?.highlights && pkg?.highlights?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Package Highlights</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {pkg?.highlights?.map((highlight, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            <span className="text-sm text-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  {pkg?.amenities && pkg?.amenities?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">What's Included</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {pkg?.amenities?.map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                              <Icon 
                                name={getAmenityIcon(amenity)} 
                                size={14} 
                                className="text-primary" 
                              />
                            </div>
                            <span className="text-sm text-foreground capitalize">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Package Info */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Icon name="Info" size={16} className="text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground mb-2">Important Information:</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Prices are per person based on double occupancy</li>
                          <li>• Package includes all mentioned amenities and activities</li>
                          <li>• Booking confirmation will be sent via email</li>
                          <li>• Cancellation policy applies as per terms</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Book Now Button */}
            <div className="p-6 border-t border-border bg-card/50">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-foreground">
                    {formatPrice(pkg?.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getDurationText(pkg?.duration)} • per person
                  </div>
                </div>
                
                <div className="flex space-x-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 sm:flex-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleBookNow}
                    iconName="ArrowRight"
                    iconPosition="right"
                    className="flex-1 sm:flex-none shadow-lg hover-lift"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PackageBookingModal;