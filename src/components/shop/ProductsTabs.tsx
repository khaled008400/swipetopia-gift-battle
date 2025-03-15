
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsGrid from "./ProductsGrid";
import ShopService from "@/services/shop.service";

interface ProductsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  likedProducts: string[];
  toggleLike: (id: string) => void;
}

const ProductsTabs = ({ activeTab, setActiveTab, likedProducts, toggleLike }: ProductsTabsProps) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await ShopService.getProducts();
        
        // For demo purposes, we'll just split the products
        const featured = allProducts.filter((_, index) => index % 2 === 0);
        const newArrivals = allProducts.filter((_, index) => index % 2 === 1);
        
        setFeaturedProducts(featured);
        setNewProducts(newArrivals);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <div className="px-4 mb-20">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6 bg-app-gray-dark">
          <TabsTrigger 
            value="featured" 
            className="data-[state=active]:bg-app-yellow data-[state=active]:text-app-black py-2.5"
          >
            Featured
          </TabsTrigger>
          <TabsTrigger 
            value="new" 
            className="data-[state=active]:bg-app-yellow data-[state=active]:text-app-black py-2.5"
          >
            New Arrivals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="animate-fade-in">
          <ProductsGrid 
            products={featuredProducts}
            activeTab="featured"
            likedProducts={likedProducts}
            toggleLike={toggleLike}
          />
        </TabsContent>

        <TabsContent value="new" className="animate-fade-in">
          <ProductsGrid 
            products={newProducts}
            activeTab="new"
            likedProducts={likedProducts}
            toggleLike={toggleLike}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsTabs;
