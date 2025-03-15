
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ShopHeader from "../components/shop/ShopHeader";
import ShopSearch from "../components/shop/ShopSearch";
import LiveSelling from "../components/shop/LiveSelling";
import ShopShorts from "../components/shop/ShopShorts";
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, hasRole } = useAuth();

  // Fetch user's liked products when component mounts
  useEffect(() => {
    if (user) {
      fetchLikedProducts();
    }
  }, [user]);

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
      
      if (result.liked) {
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
      <ShopSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
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
      
      <LiveSelling />
      <ShopShorts />
      <ShopCategories activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <ProductsTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        likedProducts={likedProducts} 
        toggleLike={toggleLike} 
      />
    </div>
  );
};

export default ShopPage;
