
import React from "react";

// Categories
const CATEGORIES = ["ALL", "MEN", "WOMEN", "DRESS", "KURTA"];

interface ShopCategoriesProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const ShopCategories = ({ activeCategory, setActiveCategory }: ShopCategoriesProps) => {
  return (
    <div className="px-4 mb-4">
      <h3 className="text-white font-medium mb-2 flex items-center">
        <span className="grid grid-cols-2 grid-rows-2 gap-0.5 w-4 h-4 mr-1">
          <span className="bg-white w-1.5 h-1.5"></span>
          <span className="bg-white w-1.5 h-1.5"></span>
          <span className="bg-white w-1.5 h-1.5"></span>
          <span className="bg-white w-1.5 h-1.5"></span>
        </span>
        New Categories
      </h3>
      <div className="flex overflow-x-auto no-scrollbar space-x-2 py-1">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`py-1 px-4 rounded-full text-sm font-medium min-w-max ${
              activeCategory === category 
                ? "bg-app-yellow text-app-black" 
                : "bg-app-gray-dark text-white"
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
