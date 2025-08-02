import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActionCards = ({ lastBooking }) => {
  const quickActions = [
    {
      id: 'book-new',
      title: 'Book New Trip',
      description: 'Start a fresh booking',
      icon: 'Plus',
      color: 'bg-primary',
      path: '/trip-booking-form'
    },
    {
      id: 'repeat-booking',
      title: 'Repeat Last Booking',
      description: lastBooking ? `${lastBooking?.pickup} to ${lastBooking?.destination}` : 'No previous bookings',
      icon: 'RotateCcw',
      color: 'bg-secondary',
      path: lastBooking ? '/trip-booking-form?repeat=true' : '/trip-booking-form',
      disabled: !lastBooking
    },
    {
      id: 'browse-packages',
      title: 'Browse Packages',
      description: 'Explore tour packages',
      icon: 'MapPin',
      color: 'bg-accent',
      path: '/package-tours-catalog'
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="fluid-text-xl font-semibold text-card-foreground mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions?.map((action) => (
          <Link
            key={action?.id}
            to={action?.path}
            className={`block hover-lift transition-all duration-200 ${
              action?.disabled ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            <div className="glass-morphism bg-card/95 rounded-xl border border-border p-6 hover:border-primary/50">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${action?.color}`}>
                  <Icon name={action?.icon} size={24} color="white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground mb-1">
                    {action?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {action?.description}
                  </p>
                </div>
                <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCards;