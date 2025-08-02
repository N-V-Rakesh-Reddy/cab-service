import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';


const AccountSecurity = ({ securitySettings, onSave, className = '' }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(securitySettings?.twoFactorEnabled || false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const activeSessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: 2,
      device: 'Mobile App on Android',
      location: 'Mumbai, India',
      lastActive: '1 hour ago',
      current: false
    },
    {
      id: 3,
      device: 'Safari on iPhone',
      location: 'Delhi, India',
      lastActive: '2 days ago',
      current: false
    }
  ];

  const handlePasswordChange = async () => {
    const newErrors = {};
    
    if (!passwordData?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors)?.length > 0) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveSection(null);
      onSave({ type: 'password', success: true });
    } catch (error) {
      setErrors({ general: 'Failed to change password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async (enabled) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTwoFactorEnabled(enabled);
      onSave({ type: 'twoFactor', enabled });
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async (sessionId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave({ type: 'endSession', sessionId });
    } catch (error) {
      console.error('Failed to end session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`glass-morphism bg-card/95 rounded-xl border border-border ${className}`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-lg bg-error/10">
            <Icon name="Shield" size={20} className="text-error" />
          </div>
          <div>
            <h2 className="fluid-text-lg font-semibold text-card-foreground">
              Account Security
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your password, sessions, and security settings
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Change Password */}
          <div className="border border-border rounded-lg">
            <div 
              className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
              onClick={() => setActiveSection(activeSection === 'password' ? null : 'password')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name="Key" size={18} className="text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-card-foreground">Change Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Last changed 3 months ago
                    </p>
                  </div>
                </div>
                <Icon 
                  name={activeSection === 'password' ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground" 
                />
              </div>
            </div>

            {activeSection === 'password' && (
              <div className="p-4 border-t border-border space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData?.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e?.target?.value }))}
                  error={errors?.currentPassword}
                  required
                />
                
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData?.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e?.target?.value }))}
                  error={errors?.newPassword}
                  description="Must be at least 8 characters long"
                  required
                />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData?.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e?.target?.value }))}
                  error={errors?.confirmPassword}
                  required
                />

                {errors?.general && (
                  <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                    <p className="text-sm text-error">{errors?.general}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="default"
                    onClick={handlePasswordChange}
                    loading={isLoading}
                    iconName="Check"
                    iconPosition="left"
                  >
                    Update Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveSection(null);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setErrors({});
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Two-Factor Authentication */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Smartphone" size={18} className="text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-card-foreground">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    {twoFactorEnabled ? 'Enabled - Your account is protected' : 'Add an extra layer of security'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  twoFactorEnabled 
                    ? 'bg-success/10 text-success' :'bg-warning/10 text-warning'
                }`}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </div>
                <Button
                  variant={twoFactorEnabled ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleTwoFactorToggle(!twoFactorEnabled)}
                  loading={isLoading}
                  iconName={twoFactorEnabled ? "ShieldOff" : "Shield"}
                  iconPosition="left"
                >
                  {twoFactorEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <Icon name="Monitor" size={18} className="text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-card-foreground">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage devices that are signed into your account
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {activeSessions?.map((session) => (
                <div key={session?.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        session?.current ? 'bg-success/10' : 'bg-muted/20'
                      }`}>
                        <Icon 
                          name={session?.device?.includes('Mobile') ? "Smartphone" : "Monitor"} 
                          size={16} 
                          className={session?.current ? 'text-success' : 'text-muted-foreground'} 
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-card-foreground text-sm">
                            {session?.device}
                          </h4>
                          {session?.current && (
                            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {session?.location} • {session?.lastActive}
                        </p>
                      </div>
                    </div>
                    
                    {!session?.current && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEndSession(session?.id)}
                        iconName="LogOut"
                        iconPosition="left"
                      >
                        End Session
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSecurity;