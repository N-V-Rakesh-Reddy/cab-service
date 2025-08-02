import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ 
  activeTab = 'current', 
  onTabChange = () => {}, 
  tripCounts = {},
  className = '' 
}) => {
  const tabs = [
    {
      id: 'current',
      label: 'Current',
      icon: 'Navigation',
      count: tripCounts?.current || 0
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: 'Calendar',
      count: tripCounts?.upcoming || 0
    },
    {
      id: 'past',
      label: 'Past',
      icon: 'History',
      count: tripCounts?.past || 0
    }
  ];

  return (
    <div className={`glass-morphism bg-card/30 rounded-xl border border-border p-1 ${className}`}>
      <div className="flex relative">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`relative flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab?.id
                ? 'text-primary' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            {activeTab === tab?.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary/10 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            <div className="relative flex items-center space-x-2">
              <Icon 
                name={tab?.icon} 
                size={16} 
                strokeWidth={activeTab === tab?.id ? 2.5 : 2}
              />
              <span>{tab?.label}</span>
              {tab?.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tab?.count}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;