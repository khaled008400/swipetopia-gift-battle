
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ShopSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ShopSearch = ({ searchQuery, setSearchQuery }: ShopSearchProps) => {
  return (
    <div className="relative px-4 mb-6">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-app-gray-dark pl-9 pr-12 border-app-gray-light text-white rounded-full h-11"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-9 w-9 rounded-full"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ShopSearch;
