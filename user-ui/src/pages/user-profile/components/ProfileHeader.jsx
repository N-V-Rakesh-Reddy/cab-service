import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileHeader = ({ user, membershipStatus, className = '' }) => {
  const getMembershipConfig = (status) => {
    const configs = {
      'premium': {
        label: 'Premium Member',
        icon: 'Crown',
        color: 'text-warning',
        bgColor: 'bg-warning/10'
      },
      'gold': {
        label: 'Gold Member',
        icon: 'Star',
        color: 'text-warning',
        bgColor: 'bg-warning/10'
      },
      'silver': {
        label: 'Silver Member',
        icon: 'Award',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/20'
      },
      'regular': {
        label: 'Regular Member',
        icon: 'User',
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/20'
      }
    };
    return configs?.[status] || configs?.['regular'];
  };

  const membershipConfig = getMembershipConfig(membershipStatus);

  return (
    <div className={`glass-morphism bg-card/95 rounded-xl border border-border p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Avatar */}
        <div className="relative">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <Image 
                src={user?.avatar} 
                alt={`${user?.name}'s profile`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Icon name="User" size={32} className="text-muted-foreground" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-success flex items-center justify-center border-2 border-card">
            <Icon name="Check" size={12} color="white" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="fluid-text-2xl font-bold text-card-foreground mb-2">
            {user?.name}
          </h1>
          <p className="text-muted-foreground mb-3">
            {user?.email}
          </p>
          
          {/* Membership Badge */}
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${membershipConfig?.bgColor}`}>
            <Icon name={membershipConfig?.icon} size={16} className={membershipConfig?.color} />
            <span className={`text-sm font-medium ${membershipConfig?.color}`}>
              {membershipConfig?.label}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex space-x-6 sm:space-x-4 sm:flex-col sm:space-y-2">
          <div className="text-center">
            <p className="fluid-text-lg font-bold text-card-foreground">
              {user?.totalTrips || 0}
            </p>
            <p className="text-xs text-muted-foreground">Total Trips</p>
          </div>
          <div className="text-center">
            <p className="fluid-text-lg font-bold text-card-foreground">
              {user?.rating || '4.8'}
            </p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;