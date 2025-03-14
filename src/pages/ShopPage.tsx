
import React, { useState } from "react";
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

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeTab, setActiveTab] = useState("featured");
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user, hasRole } = useAuth();

  const toggleLike = (productId: string) => {
    if (likedProducts.includes(productId)) {
      setLikedProducts(likedProducts.filter(id => id !== productId));
      toast({
        description: "Removed from favorites",
        duration: 2000,
      });
    } else {
      setLikedProducts([...likedProducts, productId]);
      toast({
        description: "Added to favorites",
        duration: 2000,
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
