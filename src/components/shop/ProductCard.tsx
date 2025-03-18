
import React from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product.types";
import { Badge } from "@/components/ui/badge";

export interface ProductProps {
  product: Product;
  onLike?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  isLiked?: boolean;
}

const ProductCard: React.FC<ProductProps> = ({ 
  product, 
  onLike, 
  onAddToCart, 
  isLiked = false 
}) => {
  const handleLikeClick = () => {
    if (onLike) {
      onLike(product.id);
    }
  };
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };
  
  const displayDiscount = product.original_price && product.original_price > product.price;
  
  return (
    <Card className="overflow-hidden h-full transition-transform hover:scale-[1.02] group relative">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount badge */}
        {displayDiscount && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-600 text-white">
              {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
            </Badge>
          </div>
        )}
        
        {/* Like button */}
        {onLike && (
          <button 
            className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md transition-transform hover:scale-110 z-10"
            onClick={handleLikeClick}
          >
            <Heart 
              className={cn("w-4 h-4", isLiked ? "fill-red-500 text-red-500" : "text-gray-800")} 
            />
          </button>
        )}
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mt-1 mb-2">
            <div className="flex">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-3 h-3", 
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  )} 
                />
              ))}
            </div>
            {product.reviews_count && (
              <span className="text-xs text-muted-foreground ml-1">({product.reviews_count})</span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <span className="font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {displayDiscount && (
              <span className="ml-2 text-xs text-gray-500 line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          
          {onAddToCart && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAddToCart}
              className="h-8"
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          )}
          
          {product.stock_quantity === 0 && (
            <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">
              Out of stock
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
