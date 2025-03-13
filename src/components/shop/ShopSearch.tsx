
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ShopSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ShopSearch = ({ searchQuery, setSearchQuery }: ShopSearchProps) => {
  return (
    <div className="relative px-4 mb-4">
      <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-app-gray-dark pl-10 pr-10 border-app-gray-light text-white rounded-full"
      />
      <button className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400">
        <span className="grid grid-cols-2 grid-rows-2 gap-0.5 w-4 h-4">
          <span className="bg-white w-1.5 h-1.5"></span>
          <span className="bg-white w-1.5 h-1.5"></span>
          <span className="bg-white w-1.5 h-1.5"></span>
          <span className="bg-white w-1.5 h-1.5"></span>
        </span>
      </button>
    </div>
  );
};

export default ShopSearch;
