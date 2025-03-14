
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ExploreSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ExploreSearch = ({ searchQuery, setSearchQuery }: ExploreSearchProps) => {
  return (
    <div className="relative mb-6">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search hashtags, users, videos, lives..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-app-gray-dark pl-9 pr-4 border-app-gray-light text-white rounded-full h-11"
        />
      </div>
    </div>
  );
};

export default ExploreSearch;
