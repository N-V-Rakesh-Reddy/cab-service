import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ 
  onSearch = () => {}, 
  onClear = () => {},
  placeholder = "Search by destination, date, or booking ID...",
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="search"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e?.target?.value)}
          className="pl-10 pr-10"
        />
        
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Icon name="Search" size={16} className="text-muted-foreground" />
        </div>
        
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
          >
            <Icon name="X" size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;