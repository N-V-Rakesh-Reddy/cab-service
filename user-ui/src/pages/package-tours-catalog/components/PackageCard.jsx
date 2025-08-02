import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PackageCard = ({ 
  package: pkg, 
  onBookNow = () => {}, 
  className = '' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const handleBookNow = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onBookNow(pkg);
  };

  return (
    <div className={`group glass-morphism bg-card/95 rounded-xl border border-border shadow-card hover:shadow-modal transition-all duration-300 hover-lift overflow-hidden ${className}`}>
      {/* Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={pkg?.image}
          alt={pkg?.title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
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
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col space-y-2">
            {pkg?.isPopular && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Popular
              </span>
            )}
            {pkg?.discount && (
              <span className="px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded-full">
                {pkg?.discount}% OFF
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1 glass-morphism bg-black/30 px-2 py-1 rounded-full">
            <Icon name="Star" size={12} className="text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">{pkg?.rating}</span>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3">
          <div className="flex items-center space-x-1 glass-morphism bg-black/30 px-2 py-1 rounded-full">
            <Icon name="Clock" size={12} className="text-white" />
            <span className="text-white text-xs font-medium">
              {getDurationText(pkg?.duration)}
            </span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Location */}
        <div>
          <h3 className="font-semibold text-card-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {pkg?.title}
          </h3>
          <div className="flex items-center space-x-1 mt-1">
            <Icon name="MapPin" size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{pkg?.location}</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {pkg?.description}
          </p>
          
          {pkg?.highlights && pkg?.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {pkg?.highlights?.slice(0, 3)?.map((highlight, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  {highlight}
                </span>
              ))}
              {pkg?.highlights?.length > 3 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                  +{pkg?.highlights?.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Amenities */}
        {pkg?.amenities && pkg?.amenities?.length > 0 && (
          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
            {pkg?.amenities?.slice(0, 4)?.map((amenity, index) => (
              <div key={index} className="flex items-center space-x-1">
                <Icon 
                  name={
                    amenity === 'meals' ? 'Utensils' :
                    amenity === 'accommodation' ? 'Bed' :
                    amenity === 'transport' ? 'Car' :
                    amenity === 'guide'? 'User' : 'Check'
                  } 
                  size={12} 
                />
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price and Booking */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-card-foreground">
                {formatPrice(pkg?.price)}
              </span>
              {pkg?.originalPrice && pkg?.originalPrice > pkg?.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(pkg?.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">per person</span>
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleBookNow}
            iconName="ArrowRight"
            iconPosition="right"
            className="hover-lift"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;