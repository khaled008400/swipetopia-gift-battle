
import React from "react";
import { LayoutGrid } from "lucide-react";

// Categories
const CATEGORIES = ["ALL", "MEN", "WOMEN", "DRESS", "KURTA", "SHOES", "WATCHES"];

interface ShopCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const ShopCategories = ({ activeCategory, setActiveCategory }: ShopCategoriesProps) => {
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
        {CATEGORIES.map((category) => (
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
