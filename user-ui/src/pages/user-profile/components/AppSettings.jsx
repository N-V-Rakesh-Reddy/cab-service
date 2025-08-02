import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AppSettings = ({ settings, onSave, className = '' }) => {
  const [formData, setFormData] = useState({
    theme: settings?.theme || 'dark',
    language: settings?.language || 'en',
    notifications: {
      push: settings?.notifications?.push || true,
      email: settings?.notifications?.email || true,
      sms: settings?.notifications?.sms || false,
      marketing: settings?.notifications?.marketing || false
    },
    privacy: {
      shareLocation: settings?.privacy?.shareLocation || true,
      shareTrips: settings?.privacy?.shareTrips || false,
      analytics: settings?.privacy?.analytics || true
    },
    accessibility: {
      highContrast: settings?.accessibility?.highContrast || false,
      largeText: settings?.accessibility?.largeText || false,
      reduceMotion: settings?.accessibility?.reduceMotion || false
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  const handleThemeChange = async (theme) => {
    setFormData(prev => ({ ...prev, theme }));
    
    // Apply theme immediately for preview
    if (theme === 'light') {
      document.documentElement?.classList?.add('light');
    } else {
      document.documentElement?.classList?.remove('light');
    }
    
    // Save to settings
    await handleSave({ ...formData, theme });
  };

  const handleLanguageChange = async (language) => {
    setFormData(prev => ({ ...prev, language }));
    await handleSave({ ...formData, language });
  };

  const handleNotificationChange = (type, checked) => {
    const newNotifications = { ...formData?.notifications, [type]: checked };
    setFormData(prev => ({ ...prev, notifications: newNotifications }));
  };

  const handlePrivacyChange = (type, checked) => {
    const newPrivacy = { ...formData?.privacy, [type]: checked };
    setFormData(prev => ({ ...prev, privacy: newPrivacy }));
  };

  const handleAccessibilityChange = (type, checked) => {
    const newAccessibility = { ...formData?.accessibility, [type]: checked };
    setFormData(prev => ({ ...prev, accessibility: newAccessibility }));
  };

  const handleSave = async (dataToSave = formData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(dataToSave);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAll = () => {
    handleSave();
  };

  return (
    <div className={`glass-morphism bg-card/95 rounded-xl border border-border ${className}`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-success/10">
            <Icon name="Settings" size={20} className="text-success" />
          </div>
          <div>
            <h2 className="fluid-text-lg font-semibold text-card-foreground">
              App Settings
            </h2>
            <p className="text-sm text-muted-foreground">
              Customize your app experience and preferences
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Appearance</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-3 block">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      formData?.theme === 'dark' ?'border-primary bg-primary/10' :'border-border bg-muted/20 hover:bg-muted/30'
                    }`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-900">
                        <Icon name="Moon" size={16} color="white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-card-foreground text-sm">Dark Mode</h4>
                        <p className="text-xs text-muted-foreground">Easy on the eyes</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      formData?.theme === 'light' ?'border-primary bg-primary/10' :'border-border bg-muted/20 hover:bg-muted/30'
                    }`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-yellow-400">
                        <Icon name="Sun" size={16} color="black" />
                      </div>
                      <div>
                        <h4 className="font-medium text-card-foreground text-sm">Light Mode</h4>
                        <p className="text-xs text-muted-foreground">Bright and clear</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground mb-3 block">
                  Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {languages?.map((lang) => (
                    <div
                      key={lang?.code}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        formData?.language === lang?.code
                          ? 'border-primary bg-primary/10' :'border-border bg-muted/20 hover:bg-muted/30'
                      }`}
                      onClick={() => handleLanguageChange(lang?.code)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{lang?.flag}</span>
                        <span className="font-medium text-card-foreground text-sm">
                          {lang?.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Notifications</h3>
            <div className="space-y-3">
              <Checkbox
                label="Push Notifications"
                description="Receive real-time updates on your device"
                checked={formData?.notifications?.push}
                onChange={(e) => handleNotificationChange('push', e?.target?.checked)}
              />
              <Checkbox
                label="Email Notifications"
                description="Get booking confirmations and receipts via email"
                checked={formData?.notifications?.email}
                onChange={(e) => handleNotificationChange('email', e?.target?.checked)}
              />
              <Checkbox
                label="SMS Notifications"
                description="Receive trip updates via text messages"
                checked={formData?.notifications?.sms}
                onChange={(e) => handleNotificationChange('sms', e?.target?.checked)}
              />
              <Checkbox
                label="Marketing Communications"
                description="Get promotional offers and deals"
                checked={formData?.notifications?.marketing}
                onChange={(e) => handleNotificationChange('marketing', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Privacy</h3>
            <div className="space-y-3">
              <Checkbox
                label="Share Location Data"
                description="Allow location sharing for better service"
                checked={formData?.privacy?.shareLocation}
                onChange={(e) => handlePrivacyChange('shareLocation', e?.target?.checked)}
              />
              <Checkbox
                label="Share Trip History"
                description="Help improve our services with anonymous trip data"
                checked={formData?.privacy?.shareTrips}
                onChange={(e) => handlePrivacyChange('shareTrips', e?.target?.checked)}
              />
              <Checkbox
                label="Analytics & Performance"
                description="Share app usage data to improve performance"
                checked={formData?.privacy?.analytics}
                onChange={(e) => handlePrivacyChange('analytics', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Accessibility Settings */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Accessibility</h3>
            <div className="space-y-3">
              <Checkbox
                label="High Contrast Mode"
                description="Increase contrast for better visibility"
                checked={formData?.accessibility?.highContrast}
                onChange={(e) => handleAccessibilityChange('highContrast', e?.target?.checked)}
              />
              <Checkbox
                label="Large Text"
                description="Increase text size throughout the app"
                checked={formData?.accessibility?.largeText}
                onChange={(e) => handleAccessibilityChange('largeText', e?.target?.checked)}
              />
              <Checkbox
                label="Reduce Motion"
                description="Minimize animations and transitions"
                checked={formData?.accessibility?.reduceMotion}
                onChange={(e) => handleAccessibilityChange('reduceMotion', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Data Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Download"
                iconPosition="left"
              >
                Export My Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="Trash2"
                iconPosition="left"
              >
                Clear Cache
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="RefreshCw"
                iconPosition="left"
              >
                Reset Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                iconName="HelpCircle"
                iconPosition="left"
              >
                Get Help
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <Button
            variant="default"
            onClick={handleSaveAll}
            loading={isLoading}
            iconName="Check"
            iconPosition="left"
            fullWidth
          >
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;