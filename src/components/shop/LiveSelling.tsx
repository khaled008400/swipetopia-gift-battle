
import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import ShopService, { LiveSeller } from "@/services/shop.service";
import { useToast } from "@/components/ui/use-toast";

const LiveSelling = () => {
  const [liveSellers, setLiveSellers] = useState<LiveSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLiveSellers = async () => {
      try {
        setIsLoading(true);
        const data = await ShopService.getLiveSellers();
        setLiveSellers(data);
      } catch (error) {
        console.error("Error fetching live sellers:", error);
        toast({
          title: "Error",
          description: "Failed to load live sellers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveSellers();
  }, [toast]);

  // If there are no live sellers and we're still loading, show skeleton
  if (isLoading) {
    return (
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-app-yellow mr-1" />
            <h3 className="text-white font-medium">Live selling</h3>
          </div>
          <div className="w-14 h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar space-x-4 py-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-1 min-w-max">
              <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse"></div>
              <div className="w-10 h-3 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If there are no live sellers after loading, show empty state
  if (liveSellers.length === 0 && !isLoading) {
    return (
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-app-yellow mr-1" />
            <h3 className="text-white font-medium">Live selling</h3>
          </div>
        </div>
        <div className="py-8 text-center">
          <p className="text-gray-400 text-sm">No live sellers right now</p>
        </div>
      </div>
    );
  }

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
        {liveSellers.map(seller => (
          <div key={seller.id} className="flex flex-col items-center space-y-1 min-w-max">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-app-yellow p-0.5 relative">
                <img 
                  src={seller.avatar_url || "/placeholder.svg"} 
                  alt={seller.username || "Live seller"} 
                  className="w-full h-full rounded-full object-cover" 
                />
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  LIVE
                </span>
              </div>
              <div className="absolute -top-1 -right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                {seller.viewers >= 1000 ? `${(seller.viewers / 1000).toFixed(1)}K` : seller.viewers}
              </div>
            </div>
            <span className="text-white text-xs">{seller.username || "User"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSelling;
