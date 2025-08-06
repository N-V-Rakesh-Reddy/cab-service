import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ApiService from '../../../utils/api';

const LogoutSection = ({ onLogout, className = '' }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Call logout API
      await ApiService.logout();
      
      // Clear local storage
      localStorage.removeItem('cabBookerUser');
      localStorage.removeItem('cabBookerToken');
      localStorage.removeItem('auth_token');
      
      // Call parent logout handler
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, we should clear local data and logout
      localStorage.removeItem('cabBookerUser');
      localStorage.removeItem('cabBookerToken');
      localStorage.removeItem('auth_token');
      onLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className={`glass-morphism bg-card/95 rounded-xl border border-border ${className}`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-destructive/10">
            <Icon name="LogOut" size={20} className="text-destructive" />
          </div>
          <div>
            <h2 className="fluid-text-lg font-semibold text-card-foreground">
              Account Actions
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your account session and data
            </p>
          </div>
        </div>

        {!showConfirmation ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                fullWidth
                iconName="Download"
                iconPosition="left"
              >
                Download My Data
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                iconName="HelpCircle"
                iconPosition="left"
              >
                Contact Support
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="destructive"
                fullWidth
                onClick={() => setShowConfirmation(true)}
                iconName="LogOut"
                iconPosition="left"
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                <div>
                  <h3 className="font-medium text-card-foreground mb-2">
                    Are you sure you want to sign out?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You'll need to sign in again to access your account and continue using CabBooker services.
                  </p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>Your trip history will be saved</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>Payment methods will remain secure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span>Preferences will be restored on next login</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="destructive"
                onClick={handleLogout}
                loading={isLoading}
                iconName="LogOut"
                iconPosition="left"
                className="sm:order-2"
                fullWidth
              >
                {isLoading ? 'Signing Out...' : 'Yes, Sign Out'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                iconName="X"
                iconPosition="left"
                className="sm:order-1"
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoutSection;