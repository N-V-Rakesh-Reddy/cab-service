import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PackageCard = ({ 
  packageData, 
  index = 0,
  onBookNow = () => {} 
}) => {
  const {
    id,
    title,
    destination,
    image,
    duration,
    price,
    originalPrice,
    rating,
    reviewCount,
    highlights,
    isPopular = false
  } = packageData;

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -4 }}
      className="relative group flex-shrink-0 w-80 md:w-full"
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-4 left-4 z-10">
          <div className="glass-morphism bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            <Icon name="Star" size={12} className="inline mr-1" />
            Popular
          </div>
        </div>
      )}
      <div className="glass-morphism bg-card/80 rounded-xl border border-border overflow-hidden h-full hover:shadow-card hover-lift transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 right-4">
              <div className="bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-semibold">
                {discount}% OFF
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-card-foreground line-clamp-2">
                {title}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground ml-2">
                <Icon name="MapPin" size={14} />
                <span className="text-xs">{destination}</span>
              </div>
            </div>

            {/* Rating & Duration */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-warning fill-current" />
                <span className="font-medium text-card-foreground">{rating}</span>
                <span className="text-muted-foreground">({reviewCount})</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Icon name="Clock" size={14} />
                <span>{duration}</span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="mb-4">
            <ul className="space-y-1">
              {highlights?.slice(0, 3)?.map((highlight, idx) => (
                <li key={idx} className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="Check" size={12} className="text-primary flex-shrink-0" />
                  <span className="line-clamp-1">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-card-foreground">
                ₹{price?.toLocaleString('en-IN')}
              </span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">per person</span>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              fullWidth
              onClick={() => onBookNow(packageData)}
              iconName="Calendar"
              iconPosition="left"
            >
              Book Now
            </Button>
            <Link to={`/package-tours-catalog?package=${id}`}>
              <Button
                variant="outline"
                size="sm"
                iconName="Eye"
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageCard;