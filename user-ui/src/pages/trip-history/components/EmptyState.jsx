import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ 
  type = 'current',
  onAction = () => {},
  className = '' 
}) => {
  const getEmptyStateConfig = (type) => {
    const configs = {
      'current': {
        icon: 'Navigation',
        title: 'No Current Trips',
        description: 'You don\'t have any ongoing trips at the moment.',
        actionText: 'Book a Trip',
        actionIcon: 'Plus'
      },
      'upcoming': {
        icon: 'Calendar',
        title: 'No Upcoming Trips',
        description: 'You don\'t have any scheduled trips coming up.',
        actionText: 'Plan a Trip',
        actionIcon: 'Plus'
      },
      'past': {
        icon: 'History',
        title: 'No Trip History',
        description: 'Your completed trips will appear here once you start booking.',
        actionText: 'Book Your First Trip',
        actionIcon: 'Car'
      },
      'search': {
        icon: 'Search',
        title: 'No Results Found',
        description: 'Try adjusting your search terms or filters.',
        actionText: 'Clear Search',
        actionIcon: 'X'
      }
    };
    return configs?.[type] || configs?.['current'];
  };

  const config = getEmptyStateConfig(type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
          <Icon name={config?.icon} size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          {config?.title}
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {config?.description}
        </p>
      </div>
      <Button
        variant="default"
        onClick={onAction}
        iconName={config?.actionIcon}
        iconPosition="left"
      >
        {config?.actionText}
      </Button>
    </motion.div>
  );
};

export default EmptyState;