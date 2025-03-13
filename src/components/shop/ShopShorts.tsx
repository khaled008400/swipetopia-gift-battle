
import React from "react";
import { Zap } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem 
} from "@/components/ui/carousel";

// Mock data for limited offers
const LIMITED_OFFERS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1607082352121-fa243f3dde32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    discount: "40% OFF",
    title: "Summer Sale"
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1561069934-eee225952461?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    discount: "BOGO",
    title: "Buy 1 Get 1 Free"
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2115&auto=format&fit=crop&ixlib=rb-4.0.3",
    discount: "New Arrivals",
    title: "20% OFF"
  }
];

const ShopShorts = () => {
  return (
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Zap className="w-4 h-4 text-app-yellow mr-1" />
          <h3 className="text-white font-medium">Limited Offers</h3>
        </div>
        <button className="text-app-yellow text-xs font-medium">View All</button>
      </div>
      
      <Carousel>
        <CarouselContent>
          {LIMITED_OFFERS.map(offer => (
            <CarouselItem key={offer.id} className="basis-9/10 pl-1">
              <div className="relative h-32 rounded-xl overflow-hidden">
                <img 
                  src={offer.image} 
                  alt={offer.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                  <span className="bg-app-yellow text-app-black text-xs font-bold px-2 py-1 rounded-full w-fit mb-1">
                    {offer.discount}
                  </span>
                  <h4 className="text-white font-medium">{offer.title}</h4>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ShopShorts;
