
import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ShopSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  isLoading?: boolean;
}

const ShopSearch = ({ 
  searchQuery, 
  setSearchQuery, 
  onSearch,
  onClear,
  isLoading = false
}: ShopSearchProps) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div className="relative px-4 mb-6">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isLoading ? 'text-app-yellow animate-pulse' : 'text-gray-400'
          } w-4 h-4`} 
        />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-app-gray-dark pl-9 pr-12 border-app-gray-light text-white rounded-full h-11"
        />
        {searchQuery && (
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            onClick={onClear}
            className="absolute right-11 top-1/2 transform -translate-y-1/2 text-gray-400 h-8 w-8 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-9 w-9 rounded-full"
          onClick={() => null} // Filter functionality can be added later
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ShopSearch;
