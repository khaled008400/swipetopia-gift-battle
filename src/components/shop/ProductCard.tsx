
import React from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductProps {
  id: string;
  image: string;
  name: string;
  price: number;
  rating: number;
  isLiked: boolean;
  onToggleLike: (id: string) => void;
}

const ProductCard = ({ id, image, name, price, rating, isLiked, onToggleLike }: ProductProps) => {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      image
    });
  };
  
  return (
    <Card className="relative overflow-hidden border-none bg-gradient-to-b from-app-gray-light to-app-gray-dark">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <button 
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md transition-transform hover:scale-110"
          onClick={() => onToggleLike(id)}
        >
          <Heart 
            className={cn("w-4 h-4", isLiked ? "fill-red-500 text-red-500" : "text-gray-800")} 
          />
        </button>
      </div>
      <CardContent className="p-3">
        <h3 className="text-white font-medium text-sm line-clamp-1">{name}</h3>
        <div className="flex items-center mt-1 mb-2">
          <div className="flex text-app-yellow">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "w-3 h-3", 
                  i < Math.floor(rating) ? "fill-app-yellow text-app-yellow" : "text-gray-400"
                )} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">({rating.toFixed(1)})</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white font-bold">${price.toFixed(2)}</span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddToCart}
            className="h-8 bg-app-yellow text-app-black hover:bg-app-yellow/80 border-none"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
