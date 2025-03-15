
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&tab=products`);
      setSearchQuery('');
      setIsExpanded(false);
    }
  };
  
  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      // Focus the input when expanded
      setTimeout(() => {
        const input = document.getElementById('search-input');
        if (input) input.focus();
      }, 100);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    // Focus back on the input
    const input = document.getElementById('search-input');
    if (input) input.focus();
  };
  
  return (
    <div className="relative">
      {isExpanded ? (
        <form onSubmit={handleSearch} className="flex items-center relative">
          <Input
            id="search-input"
            type="text"
            placeholder="Search products, videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px] pr-8"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={toggleSearch}
            className="ml-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </form>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSearch}
          className="text-app-black hover:text-app-yellow"
        >
          <Search className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
