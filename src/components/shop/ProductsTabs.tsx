
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsGrid from "./ProductsGrid";

interface ProductsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  likedProducts: string[];
  toggleLike: (id: string) => void;
}

const ProductsTabs = ({ activeTab, setActiveTab, likedProducts, toggleLike }: ProductsTabsProps) => {
  return (
    <div className="px-4 mb-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6 bg-app-gray-dark">
          <TabsTrigger 
            value="featured" 
            className="data-[state=active]:bg-app-yellow data-[state=active]:text-app-black"
          >
            Featured
          </TabsTrigger>
          <TabsTrigger 
            value="new" 
            className="data-[state=active]:bg-app-yellow data-[state=active]:text-app-black"
          >
            New Arrivals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="animate-fade-in">
          <ProductsGrid 
            activeTab="featured"
            likedProducts={likedProducts}
            toggleLike={toggleLike}
          />
        </TabsContent>

        <TabsContent value="new" className="animate-fade-in">
          <ProductsGrid 
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
