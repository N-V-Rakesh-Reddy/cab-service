import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeSection = ({ user, currentTime }) => {
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="glass-morphism bg-card/95 rounded-xl border border-border p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <Icon name="User" size={24} color="white" />
          </div>
          <div>
            <h1 className="fluid-text-2xl font-bold text-card-foreground">
              {getGreeting()}, {user?.name || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
          <Icon name="MapPin" size={16} />
          <span className="text-sm">Mumbai, India</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;