
import React from "react";
import { Search, Bell } from "lucide-react";

const ShopHeader = () => {
  return (
    <div className="px-4 pt-3 pb-4 flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png" 
          alt="User" 
          className="w-10 h-10 rounded-full border-2 border-app-yellow"
        />
        <div className="ml-3">
          <h2 className="text-white font-semibold text-lg">Shop</h2>
          <p className="text-gray-400 text-xs">Find the best products</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-white">
          <Search className="w-5 h-5" />
        </button>
        <button className="text-white">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ShopHeader;
