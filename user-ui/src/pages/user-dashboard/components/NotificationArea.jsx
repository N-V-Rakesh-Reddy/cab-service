import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationArea = ({ notifications: initialNotifications = [] }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const getNotificationConfig = (type) => {
    const configs = {
      'success': {
        icon: 'CheckCircle',
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20'
      },
      'info': {
        icon: 'Info',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/20'
      },
      'warning': {
        icon: 'AlertTriangle',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20'
      },
      'promotion': {
        icon: 'Gift',
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        borderColor: 'border-accent/20'
      }
    };
    return configs?.[type] || configs?.['info'];
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev?.filter(notification => notification?.id !== id));
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (notifications?.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="fluid-text-xl font-semibold text-card-foreground mb-4">
        Notifications
      </h2>
      <div className="space-y-3">
        {notifications?.map((notification) => {
          const config = getNotificationConfig(notification?.type);
          
          return (
            <div
              key={notification?.id}
              className={`glass-morphism bg-card/95 rounded-lg border ${config?.borderColor} p-4`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${config?.bgColor} mt-0.5`}>
                  <Icon name={config?.icon} size={16} className={config?.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-card-foreground mb-1">
                        {notification?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification?.message}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification?.timestamp)}
                        </span>
                        {notification?.actionLabel && notification?.actionUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(notification?.actionUrl, '_blank')}
                            className={config?.color}
                          >
                            {notification?.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dismissNotification(notification?.id)}
                      className="h-6 w-6 text-muted-foreground hover:text-card-foreground"
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationArea;