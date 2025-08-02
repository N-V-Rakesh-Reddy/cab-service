import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ user = null, onAuthRequired = () => {}, className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { label: 'Home', path: '/landing-page', icon: 'Home', authRequired: false },
    { label: 'Book Trip', path: '/trip-booking-form', icon: 'Car', authRequired: false },
    { label: 'Packages', path: '/package-tours-catalog', icon: 'MapPin', authRequired: false },
    { label: 'Dashboard', path: '/user-dashboard', icon: 'LayoutDashboard', authRequired: true },
    { label: 'My Trips', path: '/trip-history', icon: 'Clock', authRequired: true },
  ];

  const secondaryItems = [
    { label: 'Profile', path: '/user-profile', icon: 'User', authRequired: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const getVisibleItems = () => {
    if (user) {
      return navigationItems?.filter(item => item?.authRequired || item?.path === '/landing-page');
    }
    return navigationItems?.filter(item => !item?.authRequired);
  };

  const handleNavClick = (item) => {
    if (item?.authRequired && !user) {
      onAuthRequired();
      return;
    }
    setIsMobileMenuOpen(false);
  };

  const handleAuthAction = () => {
    if (user) {
      // Handle logout
      console.log('Logout clicked');
    } else {
      onAuthRequired();
    }
  };

  return (
    <header 
      className={`sticky top-0 z-100 w-full transition-all duration-200 ${
        isScrolled ? 'glass-morphism bg-background/80' : 'bg-background'
      } border-b border-border ${className}`}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link 
          to={user ? '/user-dashboard' : '/landing-page'} 
          className="flex items-center space-x-2 hover-lift"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Icon name="Car" size={20} color="white" />
          </div>
          <span className="fluid-text-xl font-bold text-foreground">CabBooker</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {getVisibleItems()?.slice(0, 4)?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              onClick={() => handleNavClick(item)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover-lift ${
                isActive(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}

          {/* More Menu for Secondary Items */}
          {(user && secondaryItems?.length > 0) && (
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                iconName="MoreHorizontal"
                className="text-muted-foreground hover:text-foreground"
              >
                More
              </Button>
              <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 glass-morphism bg-popover/90 rounded-lg border border-border shadow-modal">
                <div className="py-2">
                  {secondaryItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      className={`flex items-center space-x-3 px-4 py-2 text-sm transition-colors hover:bg-muted ${
                        isActive(item?.path) ? 'text-primary' : 'text-popover-foreground'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Desktop Auth Button */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user?.name || 'User'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAuthAction}
                iconName="LogOut"
                iconPosition="left"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleAuthAction}
              iconName="LogIn"
              iconPosition="left"
            >
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
        </Button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-morphism bg-background/95 border-t border-border">
          <div className="px-4 py-4 space-y-2">
            {getVisibleItems()?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => handleNavClick(item)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}

            {user && secondaryItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => handleNavClick(item)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}

            <div className="pt-4 border-t border-border">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-4">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <Icon name="User" size={18} color="white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.phone || user?.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={handleAuthAction}
                    iconName="LogOut"
                    iconPosition="left"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  onClick={handleAuthAction}
                  iconName="LogIn"
                  iconPosition="left"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;