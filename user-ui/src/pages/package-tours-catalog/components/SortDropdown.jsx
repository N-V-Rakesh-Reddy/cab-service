import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortDropdown = ({ 
  sortBy = 'relevance', 
  onSortChange = () => {}, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'relevance', label: 'Relevance', icon: 'Star' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUp' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDown' },
    { value: 'duration', label: 'Duration', icon: 'Clock' },
    { value: 'popularity', label: 'Popularity', icon: 'TrendingUp' }
  ];

  const currentSort = sortOptions?.find(option => option?.value === sortBy);

  const handleSortSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        iconName="ChevronDown"
        iconPosition="right"
        className="min-w-32"
      >
        <div className="flex items-center space-x-2">
          <Icon name={currentSort?.icon || 'Star'} size={14} />
          <span className="hidden sm:inline">Sort by:</span>
          <span className="font-medium">{currentSort?.label || 'Relevance'}</span>
        </div>
      </Button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-56 glass-morphism bg-popover/95 rounded-lg border border-border shadow-modal z-50">
            <div className="py-2">
              {sortOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleSortSelect(option?.value)}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left text-sm transition-colors ${
                    sortBy === option?.value
                      ? 'bg-muted text-foreground'
                      : 'text-popover-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={option?.icon} size={16} />
                  <span>{option?.label}</span>
                  {sortBy === option?.value && (
                    <Icon name="Check" size={14} className="ml-auto text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;