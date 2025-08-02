import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const LocationInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  error,
  showGPS = true,
  showRecent = true,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value || '');
  const dropdownRef = useRef(null);

  const recentLocations = [
    "Mumbai Airport Terminal 1",
    "Bandra Kurla Complex",
    "Phoenix Mills, Lower Parel",
    "Chhatrapati Shivaji Terminus",
    "Gateway of India"
  ];

  const suggestions = [
    "Mumbai Airport Terminal 1",
    "Mumbai Airport Terminal 2",
    "Bandra Kurla Complex",
    "Phoenix Mills, Lower Parel",
    "Chhatrapati Shivaji Terminus",
    "Gateway of India",
    "Powai Lake",
    "Juhu Beach",
    "Marine Drive",
    "Colaba Causeway"
  ]?.filter(location => 
    location.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e?.target?.value;
    setSearchQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleLocationSelect = (location) => {
    setSearchQuery(location);
    onChange(location);
    setIsOpen(false);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const mockLocation = "Current Location (Andheri West, Mumbai)";
          setSearchQuery(mockLocation);
          onChange(mockLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Input
          label={label}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          error={error}
          className="pr-12"
        />
        {showGPS && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCurrentLocation}
            className="absolute right-2 top-8 h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <Icon name="MapPin" size={16} />
          </Button>
        )}
      </div>
      {isOpen && (searchQuery || showRecent) && (
        <div className="absolute top-full left-0 right-0 mt-1 glass-morphism bg-popover/95 rounded-lg border border-border shadow-modal z-50 max-h-60 overflow-y-auto">
          {searchQuery && suggestions?.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">Suggestions</p>
              {suggestions?.slice(0, 5)?.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors"
                >
                  <Icon name="MapPin" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-popover-foreground">{location}</span>
                </button>
              ))}
            </div>
          )}

          {!searchQuery && showRecent && recentLocations?.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1">Recent Locations</p>
              {recentLocations?.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors"
                >
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-popover-foreground">{location}</span>
                </button>
              ))}
            </div>
          )}

          {searchQuery && suggestions?.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No locations found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationInput;