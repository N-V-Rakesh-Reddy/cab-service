import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const TravelPreferences = ({ preferences, onSave, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    defaultPickupLocation: preferences?.defaultPickupLocation || '',
    preferredVehicleTypes: preferences?.preferredVehicleTypes || [],
    notifications: {
      sms: preferences?.notifications?.sms || false,
      email: preferences?.notifications?.email || true,
      push: preferences?.notifications?.push || true,
      promotional: preferences?.notifications?.promotional || false
    },
    accessibility: {
      wheelchairAccessible: preferences?.accessibility?.wheelchairAccessible || false,
      childSeat: preferences?.accessibility?.childSeat || false,
      petFriendly: preferences?.accessibility?.petFriendly || false
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const vehicleTypes = [
    { id: 'economy', label: 'Economy', icon: 'Car' },
    { id: 'premium', label: 'Premium', icon: 'Car' },
    { id: 'suv', label: 'SUV', icon: 'Truck' },
    { id: 'luxury', label: 'Luxury', icon: 'Car' }
  ];

  const handleVehicleTypeChange = (vehicleId, checked) => {
    setFormData(prev => ({
      ...prev,
      preferredVehicleTypes: checked
        ? [...prev?.preferredVehicleTypes, vehicleId]
        : prev?.preferredVehicleTypes?.filter(id => id !== vehicleId)
    }));
  };

  const handleNotificationChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        [type]: checked
      }
    }));
  };

  const handleAccessibilityChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      accessibility: {
        ...prev?.accessibility,
        [type]: checked
      }
    }));
  };

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
      defaultPickupLocation: preferences?.defaultPickupLocation || '',
      preferredVehicleTypes: preferences?.preferredVehicleTypes || [],
      notifications: {
        sms: preferences?.notifications?.sms || false,
        email: preferences?.notifications?.email || true,
        push: preferences?.notifications?.push || true,
        promotional: preferences?.notifications?.promotional || false
      },
      accessibility: {
        wheelchairAccessible: preferences?.accessibility?.wheelchairAccessible || false,
        childSeat: preferences?.accessibility?.childSeat || false,
        petFriendly: preferences?.accessibility?.petFriendly || false
      }
    });
    setIsEditing(false);
  };

  return (
    <div className={`glass-morphism bg-card/95 rounded-xl border border-border ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Icon name="Settings" size={20} className="text-secondary" />
            </div>
            <div>
              <h2 className="fluid-text-lg font-semibold text-card-foreground">
                Travel Preferences
              </h2>
              <p className="text-sm text-muted-foreground">
                Customize your booking experience and notifications
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
          {/* Default Pickup Location */}
          <div>
            <Input
              label="Default Pickup Location"
              type="text"
              value={formData?.defaultPickupLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, defaultPickupLocation: e?.target?.value }))}
              disabled={!isEditing}
              description="Your most frequently used pickup address"
              placeholder="Enter your default pickup location"
            />
          </div>

          {/* Preferred Vehicle Types */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-3 block">
              Preferred Vehicle Types
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {vehicleTypes?.map((vehicle) => (
                <div
                  key={vehicle?.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    formData?.preferredVehicleTypes?.includes(vehicle?.id)
                      ? 'border-primary bg-primary/10' :'border-border bg-muted/20'
                  } ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => isEditing && handleVehicleTypeChange(vehicle?.id, !formData?.preferredVehicleTypes?.includes(vehicle?.id))}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon 
                      name={vehicle?.icon} 
                      size={20} 
                      className={formData?.preferredVehicleTypes?.includes(vehicle?.id) ? 'text-primary' : 'text-muted-foreground'} 
                    />
                    <span className={`text-sm font-medium ${
                      formData?.preferredVehicleTypes?.includes(vehicle?.id) ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {vehicle?.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-3 block">
              Notification Preferences
            </label>
            <div className="space-y-3">
              <Checkbox
                label="SMS Notifications"
                description="Receive trip updates via SMS"
                checked={formData?.notifications?.sms}
                onChange={(e) => handleNotificationChange('sms', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Email Notifications"
                description="Receive booking confirmations and receipts"
                checked={formData?.notifications?.email}
                onChange={(e) => handleNotificationChange('email', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Push Notifications"
                description="Real-time updates on your device"
                checked={formData?.notifications?.push}
                onChange={(e) => handleNotificationChange('push', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Promotional Offers"
                description="Receive special deals and discounts"
                checked={formData?.notifications?.promotional}
                onChange={(e) => handleNotificationChange('promotional', e?.target?.checked)}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Accessibility Options */}
          <div>
            <label className="text-sm font-medium text-card-foreground mb-3 block">
              Accessibility & Special Requirements
            </label>
            <div className="space-y-3">
              <Checkbox
                label="Wheelchair Accessible Vehicle"
                description="Request vehicles with wheelchair accessibility"
                checked={formData?.accessibility?.wheelchairAccessible}
                onChange={(e) => handleAccessibilityChange('wheelchairAccessible', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Child Seat Required"
                description="Always request vehicles with child seats"
                checked={formData?.accessibility?.childSeat}
                onChange={(e) => handleAccessibilityChange('childSeat', e?.target?.checked)}
                disabled={!isEditing}
              />
              <Checkbox
                label="Pet-Friendly Vehicle"
                description="Prefer drivers who allow pets"
                checked={formData?.accessibility?.petFriendly}
                onChange={(e) => handleAccessibilityChange('petFriendly', e?.target?.checked)}
                disabled={!isEditing}
              />
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

export default TravelPreferences;