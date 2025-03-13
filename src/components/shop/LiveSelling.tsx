
import React from "react";
import { Zap } from "lucide-react";

// Mock data for the popular lives profiles
const LIVE_SELLERS = [
  { id: "1", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "John" },
  { id: "2", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Emma" },
  { id: "3", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Maria" },
  { id: "4", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Sam" },
  { id: "5", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Alex" },
];

const LiveSelling = () => {
  return (
    <div className="px-4 mb-4">
      <div className="flex items-center mb-2">
        <Zap className="w-4 h-4 text-white mr-1" />
        <h3 className="text-white font-medium">Popular Lives</h3>
      </div>
      <div className="flex overflow-x-auto no-scrollbar space-x-3 py-1">
        {LIVE_SELLERS.map((seller) => (
          <div key={seller.id} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-app-yellow p-1">
              <img 
                src={seller.avatar} 
                alt={seller.name} 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSelling;
