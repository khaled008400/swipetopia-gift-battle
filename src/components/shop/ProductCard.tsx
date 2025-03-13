
import React from "react";
import { Heart } from "lucide-react";

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
  return (
    <div className="relative rounded-xl overflow-hidden bg-orange-100">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-52 object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
        <h3 className="text-white font-medium text-sm">{name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-white font-bold">${price}</span>
        </div>
      </div>
      <button 
        className="absolute top-2 right-2 bg-white rounded-full p-1.5"
        onClick={() => onToggleLike(id)}
      >
        <Heart 
          className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-800"}`} 
        />
      </button>
    </div>
  );
};

export default ProductCard;
