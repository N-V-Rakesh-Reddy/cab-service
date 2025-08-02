import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  isOpen = false, 
  onClose = () => {}, 
  filters = {}, 
  onFiltersChange = () => {},
  className = '' 
}) => {
  const filterSections = [
    {
      key: 'duration',
      title: 'Duration',
      icon: 'Clock',
      options: [
        { value: '1-3', label: '1-3 Days', count: 24 },
        { value: '4-7', label: '4-7 Days', count: 18 },
        { value: '8+', label: '8+ Days', count: 12 }
      ]
    },
    {
      key: 'priceRange',
      title: 'Price Range',
      icon: 'IndianRupee',
      options: [
        { value: 'budget', label: 'Under ₹10,000', count: 32 },
        { value: 'mid', label: '₹10,000 - ₹25,000', count: 28 },
        { value: 'premium', label: '₹25,000+', count: 15 }
      ]
    },
    {
      key: 'type',
      title: 'Destination Type',
      icon: 'MapPin',
      options: [
        { value: 'hill-station', label: 'Hill Station', count: 22 },
        { value: 'beach', label: 'Beach', count: 18 },
        { value: 'heritage', label: 'Heritage', count: 16 },
        { value: 'adventure', label: 'Adventure', count: 14 },
        { value: 'wildlife', label: 'Wildlife', count: 10 },
        { value: 'spiritual', label: 'Spiritual', count: 8 }
      ]
    },
    {
      key: 'amenities',
      title: 'Amenities',
      icon: 'Star',
      options: [
        { value: 'meals', label: 'Meals Included', count: 45 },
        { value: 'accommodation', label: 'Accommodation', count: 52 },
        { value: 'guide', label: 'Tour Guide', count: 38 },
        { value: 'transport', label: 'Transportation', count: 48 },
        { value: 'activities', label: 'Activities', count: 35 }
      ]
    },
    {
      key: 'rating',
      title: 'Customer Rating',
      icon: 'Star',
      options: [
        { value: '4.5+', label: '4.5+ Stars', count: 28 },
        { value: '4+', label: '4+ Stars', count: 42 },
        { value: '3.5+', label: '3.5+ Stars', count: 58 },
        { value: '3+', label: '3+ Stars', count: 65 }
      ]
    }
  ];

  const handleFilterChange = (sectionKey, value, checked) => {
    const currentValues = filters?.[sectionKey] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues?.filter(v => v !== value);
    
    onFiltersChange({
      ...filters,
      [sectionKey]: newValues
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters)?.reduce((count, values) => {
      return count + (Array.isArray(values) ? values?.length : 0);
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-400 bg-black/50 glass-morphism"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md z-500 glass-morphism bg-background/95 border-l border-border shadow-modal overflow-y-auto ${className}`}>
        {/* Header */}
        <div className="sticky top-0 glass-morphism bg-background/95 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Filter" size={20} />
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              {getActiveFiltersCount() > 0 && (
                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
          
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="mt-2 text-muted-foreground hover:text-foreground"
            >
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Filter Sections */}
        <div className="p-4 space-y-6">
          {filterSections?.map((section) => (
            <div key={section?.key} className="space-y-3">
              <div className="flex items-center space-x-2">
                <Icon name={section?.icon} size={18} className="text-muted-foreground" />
                <h3 className="font-medium text-foreground">{section?.title}</h3>
              </div>
              
              <div className="space-y-2 pl-6">
                {section?.options?.map((option) => {
                  const isChecked = (filters?.[section?.key] || [])?.includes(option?.value);
                  
                  return (
                    <div key={option?.value} className="flex items-center justify-between">
                      <Checkbox
                        label={option?.label}
                        checked={isChecked}
                        onChange={(e) => handleFilterChange(section?.key, option?.value, e?.target?.checked)}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground ml-2">
                        ({option?.count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 glass-morphism bg-background/95 border-t border-border p-4">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
            <Button
              variant="default"
              size="lg"
              fullWidth
              onClick={onClose}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;