import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const MobileBottomNavigation = ({ user = null, onAuthRequired = () => {}, className = '' }) => {
  const location = useLocation();

  const navigationItems = [
    { label: 'Home', path: '/user-dashboard', icon: 'Home', authRequired: true },
    { label: 'Book', path: '/trip-booking-form', icon: 'Car', authRequired: false },
    { label: 'Packages', path: '/package-tours-catalog', icon: 'MapPin', authRequired: false },
    { label: 'Trips', path: '/trip-history', icon: 'Clock', authRequired: true },
    { label: 'Profile', path: '/user-profile', icon: 'User', authRequired: true },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (item, e) => {
    if (item?.authRequired && !user) {
      e?.preventDefault();
      onAuthRequired();
      return;
    }
  };

  // Only show bottom navigation for authenticated users on mobile
  if (!user) return null;

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-200 glass-morphism bg-background/95 border-t border-border ${className}`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems?.map((item) => {
          const active = isActive(item?.path);
          
          return (
            <Link
              key={item?.path}
              to={item?.path}
              onClick={(e) => handleNavClick(item, e)}
              className={`flex flex-col items-center justify-center min-w-touch min-h-touch px-2 py-1 rounded-lg transition-all duration-150 ${
                active
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`p-1 rounded-md transition-all duration-150 ${
                active ? 'bg-primary/10' : ''
              }`}>
                <Icon 
                  name={item?.icon} 
                  size={20} 
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>
              <span className={`text-xs font-medium mt-1 transition-all duration-150 ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {item?.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNavigation;