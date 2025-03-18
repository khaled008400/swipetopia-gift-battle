
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShopHeader from "../components/shop/ShopHeader";
import ShopSearch from "../components/shop/ShopSearch";
import LiveSelling from "../components/shop/LiveSelling";
import LimitedOffers from "../components/shop/LimitedOffers";
import ShopCategories from "../components/shop/ShopCategories";
import ProductsTabs from "../components/shop/ProductsTabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { StoreIcon } from "lucide-react";
import ShopService from "@/services/shop.service";

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeTab, setActiveTab] = useState("featured");
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, hasRole } = useAuth();

  // Fetch user's liked products when component mounts
  useEffect(() => {
    if (user) {
      fetchLikedProducts();
    }
  }, [user]);

  // When search query changes, fetch results if query has min length
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      handleSearch();
    } else if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      return;
    }
    
    setIsSearching(true);
    setIsLoading(true);
    
    try {
      const results = await ShopService.searchProducts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        title: "Search Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const fetchLikedProducts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const likedProductIds = await ShopService.getUserLikedProductIds();
      setLikedProducts(likedProductIds);
    } catch (error) {
      console.error("Error fetching liked products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (productId: string) => {
    if (!user) {
      toast({
        description: "Please log in to save products",
        duration: 3000,
      });
      return;
    }

    try {
      const result = await ShopService.toggleProductLike(productId);
      
      // Fix the property access - handle both boolean and object return types
      const isLiked = typeof result === 'boolean' 
        ? result 
        : (result && typeof result === 'object' && 'liked' in result 
          ? (result as { liked: boolean }).liked 
          : false);
      
      if (isLiked) {
        setLikedProducts([...likedProducts, productId]);
        toast({
          description: "Added to favorites",
          duration: 2000,
        });
      } else {
        setLikedProducts(likedProducts.filter(id => id !== productId));
        toast({
          description: "Removed from favorites",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error toggling product like:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="h-full w-full bg-app-black overflow-y-auto pb-16">
      <ShopHeader />
      <ShopSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSearch={handleSearch}
        onClear={clearSearch}
        isLoading={isLoading}
      />
      
      {hasRole("seller") && (
        <div className="px-4 my-4">
          <Link to="/seller/dashboard">
            <Button className="w-full bg-app-yellow text-app-black flex items-center justify-center">
              <StoreIcon className="mr-2 h-4 w-4" />
              Go to Seller Dashboard
            </Button>
          </Link>
        </div>
      )}
      
      {isSearching ? (
        <div className="px-4 mb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium">Search Results</h2>
            <Button 
              variant="link" 
              onClick={clearSearch} 
              className="text-app-yellow p-0 h-auto"
            >
              Clear
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-700 rounded-md mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <ProductsTabs
              products={searchResults}
              likedProducts={likedProducts}
              toggleLike={toggleLike}
              searchMode={true}
            />
          ) : (
            <div className="text-center py-12 bg-app-gray-dark rounded-lg">
              <p className="text-gray-400">No products found matching "{searchQuery}"</p>
              <Button 
                variant="link" 
                onClick={clearSearch} 
                className="text-app-yellow mt-2"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <LiveSelling />
          <LimitedOffers />
          <ShopCategories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          <ProductsTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            likedProducts={likedProducts} 
            toggleLike={toggleLike} 
          />
        </>
      )}
    </div>
  );
};

export default ShopPage;
