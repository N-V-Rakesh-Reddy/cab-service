import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TestimonialCard = ({ testimonial, index = 0 }) => {
  const { name, avatar, rating, review, tripType, location } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="glass-morphism bg-card/80 rounded-xl border border-border p-6 h-full hover:shadow-card hover-lift transition-all duration-300"
    >
      {/* Rating Stars */}
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(5)]?.map((_, i) => (
          <Icon
            key={i}
            name="Star"
            size={16}
            className={`${
              i < rating ? 'text-warning fill-current' : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
      {/* Review Text */}
      <blockquote className="text-card-foreground mb-6 leading-relaxed">
        "{review}"
      </blockquote>
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card flex items-center justify-center">
              <Icon name="Check" size={8} color="white" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-card-foreground text-sm">{name}</h4>
            <p className="text-xs text-muted-foreground">{location}</p>
          </div>
        </div>

        {/* Trip Type Badge */}
        <div className="glass-morphism bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
          {tripType}
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;