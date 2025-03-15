
import React, { useState, useEffect } from "react";
import { LayoutGrid } from "lucide-react";
import ShopService from "@/services/shop.service";
import { useToast } from "@/components/ui/use-toast";

interface ShopCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const ShopCategories = ({ activeCategory, setActiveCategory }: ShopCategoriesProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await ShopService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <LayoutGrid className="w-4 h-4 text-app-yellow mr-1" />
            <h3 className="text-white font-medium">Categories</h3>
          </div>
          <div className="w-14 h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar space-x-2 py-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-20 h-8 bg-gray-700 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <LayoutGrid className="w-4 h-4 text-app-yellow mr-1" />
          <h3 className="text-white font-medium">Categories</h3>
        </div>
        <button className="text-app-yellow text-xs font-medium">See All</button>
      </div>
      
      <div className="flex overflow-x-auto no-scrollbar space-x-2 py-1">
        {categories.map((category) => (
          <button
            key={category}
            className={`py-1.5 px-5 rounded-full text-sm font-medium min-w-max transition-colors ${
              activeCategory === category 
                ? "bg-app-yellow text-app-black" 
                : "bg-app-gray-dark text-white hover:bg-app-gray-light"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopCategories;
