import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const BookingPreferences = ({ preferences, onSave, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    favoriteRoutes: preferences?.favoriteRoutes || [],
    frequentDestinations: preferences?.frequentDestinations || [],
    defaultPassengerCount: preferences?.defaultPassengerCount || 1,
    preferredBookingTime: preferences?.preferredBookingTime || 'immediate',
    autoBookingEnabled: preferences?.autoBookingEnabled || false
  });
  const [newRoute, setNewRoute] = useState({ from: '', to: '', name: '' });
  const [newDestination, setNewDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const favoriteRoutes = [
    { id: 1, name: 'Home to Office', from: 'Bandra West, Mumbai', to: 'Andheri East, Mumbai' },
    { id: 2, name: 'Airport Route', from: 'Bandra West, Mumbai', to: 'Mumbai Airport T2' },
    { id: 3, name: 'Weekend Mall', from: 'Home', to: 'Phoenix Mills, Mumbai' }
  ];

  const frequentDestinations = [
    { id: 1, name: 'Mumbai Airport Terminal 2', address: 'Andheri East, Mumbai', count: 15 },
    { id: 2, name: 'Phoenix Mills', address: 'Lower Parel, Mumbai', count: 8 },
    { id: 3, name: 'Bandra Kurla Complex', address: 'BKC, Mumbai', count: 12 },
    { id: 4, name: 'Powai Lake', address: 'Powai, Mumbai', count: 5 }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      favoriteRoutes: preferences?.favoriteRoutes || [],
      frequentDestinations: preferences?.frequentDestinations || [],
      defaultPassengerCount: preferences?.defaultPassengerCount || 1,
      preferredBookingTime: preferences?.preferredBookingTime || 'immediate',
      autoBookingEnabled: preferences?.autoBookingEnabled || false
    });
    setIsEditing(false);
  };

  const handleRemoveRoute = (routeId) => {
    // In real app, this would remove from saved routes
    console.log('Remove route:', routeId);
  };

  const handleRemoveDestination = (destinationId) => {
    // In real app, this would remove from frequent destinations
    console.log('Remove destination:', destinationId);
  };

  return (
    <div className={`glass-morphism bg-card/95 rounded-xl border border-border ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Icon name="MapPin" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="fluid-text-lg font-semibold text-card-foreground">
                Booking Preferences
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your favorite routes and booking defaults
              </p>
            </div>
          </div>
          
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Default Settings */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Default Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Default Passenger Count
                </label>
                <select
                  value={formData?.defaultPassengerCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultPassengerCount: parseInt(e?.target?.value) }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-card-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value={1}>1 Passenger</option>
                  <option value={2}>2 Passengers</option>
                  <option value={3}>3 Passengers</option>
                  <option value={4}>4 Passengers</option>
                  <option value={5}>5+ Passengers</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Preferred Booking Time
                </label>
                <select
                  value={formData?.preferredBookingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredBookingTime: e?.target?.value }))}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-input text-card-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="immediate">Book Immediately</option>
                  <option value="15min">15 minutes later</option>
                  <option value="30min">30 minutes later</option>
                  <option value="1hour">1 hour later</option>
                  <option value="custom">Custom time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Favorite Routes */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Favorite Routes</h3>
            <div className="space-y-3">
              {favoriteRoutes?.map((route) => (
                <div key={route?.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon name="Route" size={16} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-card-foreground text-sm">
                          {route?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {route?.from} → {route?.to}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Navigation"
                        disabled={!isEditing}
                      >
                        Book Now
                      </Button>
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveRoute(route?.id)}
                          iconName="Trash2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frequent Destinations */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Frequent Destinations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {frequentDestinations?.map((destination) => (
                <div key={destination?.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <Icon name="MapPin" size={16} className="text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-card-foreground text-sm">
                          {destination?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {destination?.address}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {destination?.count} trips
                        </p>
                      </div>
                    </div>
                    
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveDestination(destination?.id)}
                        iconName="Trash2"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Plus"
                iconPosition="left"
                disabled={!isEditing}
              >
                Add Route
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="MapPin"
                iconPosition="left"
                disabled={!isEditing}
              >
                Add Destination
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Download"
                iconPosition="left"
              >
                Export Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="RotateCcw"
                iconPosition="left"
                disabled={!isEditing}
              >
                Reset All
              </Button>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
            <Button
              variant="default"
              onClick={handleSave}
              loading={isLoading}
              iconName="Check"
              iconPosition="left"
              className="sm:order-2"
            >
              Save Preferences
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              iconName="X"
              iconPosition="left"
              className="sm:order-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPreferences;