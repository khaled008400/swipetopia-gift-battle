
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import ShopService, { LimitedOffer } from "@/services/shop.service";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const LimitedOffers = () => {
  const [offers, setOffers] = useState<LimitedOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const data = await ShopService.getLimitedOffers();
        setOffers(data);
      } catch (error) {
        console.error("Error fetching limited offers:", error);
        toast({
          title: "Error",
          description: "Failed to load limited offers",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [toast]);

  // Calculate time remaining for each offer
  const getTimeRemaining = (endDate: string) => {
    const total = new Date(endDate).getTime() - new Date().getTime();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-app-yellow mr-1" />
            <h3 className="text-white font-medium">Limited Time Offers</h3>
          </div>
          <div className="w-14 h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-[3/4] bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // If there are no offers, don't render the component
  if (offers.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-app-yellow mr-1" />
          <h3 className="text-white font-medium">Limited Time Offers</h3>
        </div>
        <button className="text-app-yellow text-xs font-medium flex items-center">
          See All <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {offers.slice(0, 4).map((offer) => (
          <Link to={`/product/${offer.product_id}`} key={offer.id}>
            <Card className="overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 border-0">
              <div className="relative">
                <div className="aspect-square">
                  <img 
                    src={offer.product?.image_url || "/placeholder.svg"} 
                    alt={offer.product?.name || "Product"} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                  {offer.discount_percentage}% OFF
                </Badge>
                <Badge variant="outline" className="absolute bottom-2 left-2 bg-black/70 text-white border-0">
                  <Clock className="w-3 h-3 mr-1" /> {getTimeRemaining(offer.end_date)}
                </Badge>
              </div>
              
              <CardContent className="p-2">
                <h3 className="font-medium text-xs line-clamp-1 text-white">
                  {offer.product?.name}
                </h3>
                <div className="flex items-center mt-1">
                  <span className="font-bold text-app-yellow text-sm">
                    ${(offer.product?.price || 0).toFixed(2)}
                  </span>
                  <span className="ml-1 text-xs text-gray-400 line-through">
                    ${(offer.product?.original_price || 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LimitedOffers;
