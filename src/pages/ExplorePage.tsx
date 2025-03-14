
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreSearch from "@/components/explore/ExploreSearch";
import TrendingHashtags from "@/components/explore/TrendingHashtags";
import SearchResults from "@/components/explore/SearchResults";

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-app-black text-white overflow-auto pb-20">
      <ExploreHeader />
      
      <div className="p-4">
        <ExploreSearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        {searchQuery ? (
          <SearchResults 
            searchQuery={searchQuery} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
        ) : (
          <TrendingHashtags />
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
