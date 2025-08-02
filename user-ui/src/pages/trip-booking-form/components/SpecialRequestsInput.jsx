import React from 'react';
import Icon from '../../../components/AppIcon';

const SpecialRequestsInput = ({ 
  value, 
  onChange, 
  className = '' 
}) => {
  const commonRequests = [
    'Child seat required',
    'Pet-friendly vehicle',
    'Wheelchair accessible',
    'Extra luggage space',
    'Air conditioning required',
    'No smoking vehicle'
  ];

  const handleCommonRequestClick = (request) => {
    const currentRequests = value ? value?.split('\n')?.filter(r => r?.trim()) : [];
    
    if (currentRequests?.includes(request)) {
      // Remove if already exists
      const updatedRequests = currentRequests?.filter(r => r !== request);
      onChange(updatedRequests?.join('\n'));
    } else {
      // Add if doesn't exist
      const updatedRequests = [...currentRequests, request];
      onChange(updatedRequests?.join('\n'));
    }
  };

  const isRequestSelected = (request) => {
    const currentRequests = value ? value?.split('\n')?.filter(r => r?.trim()) : [];
    return currentRequests?.includes(request);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Special Requests</h3>
        <span className="text-sm text-muted-foreground">Optional</span>
      </div>
      
      {/* Common Requests */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-2">Quick Add:</h4>
        <div className="flex flex-wrap gap-2">
          {commonRequests?.map((request, index) => (
            <button
              key={index}
              type="button"
              className={`
                px-3 py-1.5 text-sm rounded-full border transition-all duration-200
                ${isRequestSelected(request)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-primary/50'
                }
              `}
              onClick={() => handleCommonRequestClick(request)}
            >
              <div className="flex items-center space-x-1">
                {isRequestSelected(request) && (
                  <Icon name="Check" size={12} />
                )}
                <span>{request}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Requests Textarea */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Additional Requests:
        </label>
        <div className="relative">
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e?.target?.value)}
            placeholder="Enter any special requests or requirements for your trip..."
            className="w-full min-h-[100px] p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-vertical"
            maxLength={500}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {value?.length || 0}/500
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Request Guidelines:</p>
            <ul className="space-y-1">
              <li>• Requests are subject to driver and vehicle availability</li>
              <li>• Some requests may incur additional charges</li>
              <li>• We'll do our best to accommodate your needs</li>
              <li>• For urgent requests, please call our support team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialRequestsInput;