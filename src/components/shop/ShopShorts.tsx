
import React from "react";
import { Zap } from "lucide-react";

// Mock data for trending videos
const SHORTS = [
  { id: "1", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "fashionista" },
  { id: "2", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "styleguru" },
  { id: "3", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "trending" },
];

const ShopShorts = () => {
  return (
    <div className="px-4 mb-4">
      <div className="flex items-center mb-2">
        <Zap className="w-4 h-4 text-white mr-1" />
        <h3 className="text-white font-medium">Trending Videos</h3>
      </div>
      <div className="flex overflow-x-auto no-scrollbar space-x-3">
        {SHORTS.map((short) => (
          <div key={short.id} className="relative min-w-28 h-40 rounded-xl overflow-hidden">
            <img 
              src={short.thumbnail} 
              alt={short.username} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopShorts;
