import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TripTypeCard = ({ 
  tripType, 
  isSelected = false, 
  onSelect = () => {},
  index = 0 
}) => {
  const tripTypeConfig = {
    'one-way': {
      icon: 'ArrowRight',
      title: 'One Way',
      description: 'Perfect for single destination trips',
      features: ['Instant booking', 'Fixed pricing', 'Professional drivers'],
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    'round-trip': {
      icon: 'ArrowLeftRight',
      title: 'Round Trip',
      description: 'Return journey with flexible timing',
      features: ['Return booking', 'Wait time included', 'Cost effective'],
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    },
    'local': {
      icon: 'MapPin',
      title: 'Local',
      description: 'Hourly packages for city exploration',
      features: ['Hourly packages', 'Multiple stops', 'Local expertise'],
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    },
    'airport': {
      icon: 'Plane',
      title: 'Airport',
      description: 'Reliable airport transfers',
      features: ['Flight tracking', 'Meet & greet', 'Luggage assistance'],
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    }
  };

  const config = tripTypeConfig?.[tripType] || tripTypeConfig?.['one-way'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(tripType)}
      className={`relative cursor-pointer group ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div className={`glass-morphism bg-card/80 rounded-xl border transition-all duration-300 p-6 h-full hover:shadow-card hover-lift ${
        isSelected 
          ? `${config?.borderColor} border-2` 
          : 'border-border hover:border-primary/30'
      }`}>
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${config?.bgColor}`}>
          <Icon name={config?.icon} size={24} className={config?.color} />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              {config?.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {config?.description}
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-2">
            {config?.features?.map((feature, idx) => (
              <li key={idx} className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Icon name="Check" size={14} className={config?.color} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4"
          >
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Icon name="Check" size={14} color="white" />
            </div>
          </motion.div>
        )}

        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default TripTypeCard;