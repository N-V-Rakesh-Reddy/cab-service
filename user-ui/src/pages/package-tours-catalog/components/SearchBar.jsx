import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ 
  searchQuery = '', 
  onSearchChange = () => {}, 
  suggestions = [],
  onSuggestionSelect = () => {},
  className = '' 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  useEffect(() => {
    setActiveSuggestion(-1);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    onSearchChange(value);
    setShowSuggestions(value?.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setActiveSuggestion(prev => 
          prev < suggestions?.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e?.preventDefault();
        if (activeSuggestion >= 0) {
          handleSuggestionClick(suggestions?.[activeSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="search"
          placeholder="Search destinations, packages..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(searchQuery?.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-10"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon name="Search" size={18} className="text-muted-foreground" />
        </div>
      </div>
      {showSuggestions && suggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-morphism bg-popover/95 rounded-lg border border-border shadow-modal z-50 max-h-60 overflow-y-auto">
          {suggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                index === activeSuggestion
                  ? 'bg-muted text-foreground'
                  : 'text-popover-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name="MapPin" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{suggestion?.name}</p>
                {suggestion?.type && (
                  <p className="text-xs text-muted-foreground">{suggestion?.type}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;