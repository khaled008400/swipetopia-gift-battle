
import React from "react";
import { Zap } from "lucide-react";

// Mock data for the live sellers
const LIVE_SELLERS = [
  {
    id: "1",
    avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
    name: "John",
    viewers: "2.5K"
  }, 
  {
    id: "2",
    avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
    name: "Emma",
    viewers: "1.8K"
  }, 
  {
    id: "3",
    avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
    name: "Maria",
    viewers: "3.2K"
  }, 
  {
    id: "4",
    avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
    name: "Sam",
    viewers: "4.7K"
  }, 
  {
    id: "5",
    avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
    name: "Alex",
    viewers: "985"
  }
];

const LiveSelling = () => {
  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Zap className="w-4 h-4 text-app-yellow mr-1" />
          <h3 className="text-white font-medium">Live selling</h3>
        </div>
        <button className="text-app-yellow text-xs font-medium">See All</button>
      </div>
      
      <div className="flex overflow-x-auto no-scrollbar space-x-4 py-1">
        {LIVE_SELLERS.map(seller => (
          <div key={seller.id} className="flex flex-col items-center space-y-1 min-w-max">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-app-yellow p-0.5 relative">
                <img 
                  src={seller.avatar} 
                  alt={seller.name} 
                  className="w-full h-full rounded-full object-cover" 
                />
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  LIVE
                </span>
              </div>
              <div className="absolute -top-1 -right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                {seller.viewers}
              </div>
            </div>
            <span className="text-white text-xs">{seller.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSelling;
