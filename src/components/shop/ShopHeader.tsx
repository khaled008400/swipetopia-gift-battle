
import React, { useState } from "react";
import { ShoppingCart, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import CartSheet from "./CartSheet";

const ShopHeader = () => {
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  
  return (
    <>
      <div className="px-4 pt-3 pb-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png" 
            alt="User" 
            className="w-10 h-10 rounded-full border-2 border-app-yellow"
          />
          <div className="ml-3">
            <h2 className="text-white font-semibold text-lg">Fashion Shop</h2>
            <p className="text-gray-400 text-xs">Find the best products</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              className="text-white p-1"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-app-yellow text-app-black text-[10px]">
                {itemCount}
              </Badge>
            )}
          </div>
          <div className="relative">
            <button className="text-white p-1">
              <Bell className="w-5 h-5" />
            </button>
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">2</Badge>
          </div>
        </div>
      </div>
      
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default ShopHeader;
