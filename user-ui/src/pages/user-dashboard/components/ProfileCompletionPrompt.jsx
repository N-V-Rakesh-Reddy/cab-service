import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileCompletionPrompt = ({ user, completionPercentage = 0 }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if profile is complete or user dismissed
  if (completionPercentage >= 100 || isDismissed) {
    return null;
  }

  const getMissingFields = () => {
    const fields = [];
    if (!user?.email) fields?.push('Email address');
    if (!user?.emergencyContact) fields?.push('Emergency contact');
    if (!user?.address) fields?.push('Home address');
    if (!user?.dateOfBirth) fields?.push('Date of birth');
    return fields;
  };

  const missingFields = getMissingFields();

  return (
    <div className="glass-morphism bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="p-3 rounded-lg bg-primary/20">
            <Icon name="User" size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground mb-2">
              Complete Your Profile
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add more details to enhance your booking experience and get personalized recommendations.
            </p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Profile Completion</span>
                <span className="text-xs font-medium text-primary">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Missing Fields */}
            {missingFields?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Missing information:</p>
                <div className="flex flex-wrap gap-2">
                  {missingFields?.slice(0, 3)?.map((field, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                    >
                      {field}
                    </span>
                  ))}
                  {missingFields?.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                      +{missingFields?.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/user-profile">
                <Button variant="default" size="sm" iconName="ArrowRight" iconPosition="right">
                  Complete Profile
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsDismissed(true)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDismissed(true)}
          className="h-6 w-6 text-muted-foreground hover:text-card-foreground"
        >
          <Icon name="X" size={14} />
        </Button>
      </div>
    </div>
  );
};

export default ProfileCompletionPrompt;