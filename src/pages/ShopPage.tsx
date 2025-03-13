
import React, { useState } from "react";
import ShopHeader from "../components/shop/ShopHeader";
import ShopSearch from "../components/shop/ShopSearch";
import LiveSelling from "../components/shop/LiveSelling";
import ShopShorts from "../components/shop/ShopShorts";
import ShopCategories from "../components/shop/ShopCategories";
import ProductsTabs from "../components/shop/ProductsTabs";

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeTab, setActiveTab] = useState("featured");
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLike = (productId: string) => {
    if (likedProducts.includes(productId)) {
      setLikedProducts(likedProducts.filter(id => id !== productId));
    } else {
      setLikedProducts([...likedProducts, productId]);
    }
  };

  return (
    <div className="h-full w-full bg-app-black overflow-y-auto pb-16">
      <ShopHeader />
      <ShopSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
