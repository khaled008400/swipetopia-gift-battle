
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ExploreSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ExploreSearch = ({ searchQuery, setSearchQuery }: ExploreSearchProps) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        setSearchQuery(inputValue);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, setSearchQuery]);
  
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search users, videos, hashtags..."
        className="pl-10 bg-app-gray-dark border-app-gray-light text-white"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default ExploreSearch;
