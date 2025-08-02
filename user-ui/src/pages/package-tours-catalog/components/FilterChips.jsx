import React from 'react';

import Button from '../../../components/ui/Button';

const FilterChips = ({ 
  activeFilters = {}, 
  onFilterChange = () => {}, 
  onShowFilters = () => {},
  className = '' 
}) => {
  const filterOptions = [
    {
      key: 'duration',
      label: 'Duration',
      options: [
        { value: '1-3', label: '1-3 Days' },
        { value: '4-7', label: '4-7 Days' },
        { value: '8+', label: '8+ Days' }
      ]
    },
    {
      key: 'priceRange',
      label: 'Price',
      options: [
        { value: 'budget', label: 'Under ₹10K' },
        { value: 'mid', label: '₹10K-25K' },
        { value: 'premium', label: '₹25K+' }
      ]
    },
    {
      key: 'type',
      label: 'Type',
      options: [
        { value: 'hill-station', label: 'Hill Station' },
        { value: 'beach', label: 'Beach' },
        { value: 'heritage', label: 'Heritage' },
        { value: 'adventure', label: 'Adventure' }
      ]
    }
  ];

  const handleChipClick = (filterKey, value) => {
    const currentValues = activeFilters?.[filterKey] || [];
    const newValues = currentValues?.includes(value)
      ? currentValues?.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...activeFilters,
      [filterKey]: newValues
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(activeFilters)?.reduce((count, values) => {
      return count + (Array.isArray(values) ? values?.length : 0);
    }, 0);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Filter Toggle and Clear */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onShowFilters}
          iconName="Filter"
          iconPosition="left"
        >
          Filters
          {getActiveFiltersCount() > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>

        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {filterOptions?.map((filter) => (
          <div key={filter?.key} className="flex flex-wrap gap-1">
            {filter?.options?.map((option) => {
              const isActive = (activeFilters?.[filter?.key] || [])?.includes(option?.value);
              
              return (
                <button
                  key={option?.value}
                  onClick={() => handleChipClick(filter?.key, option?.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 hover-lift ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  {option?.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;