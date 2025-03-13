
import React from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// Mock featured products
const FEATURED_PRODUCTS = [
  { 
    id: "1", 
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=772&h=900&auto=format&fit=crop",
    name: "Red Dress - Summer Collection",
    price: 129.99,
    rating: 4.8,
    featured: true
  },
  { 
    id: "2", 
    image: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=772&h=900&auto=format&fit=crop",
    name: "Black Turtleneck Sweater",
    price: 89.99,
    rating: 4.6,
    featured: true
  },
  { 
    id: "3", 
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Stylish Sunglasses - UV Protection",
    price: 49.99,
    rating: 4.2,
    featured: true
  },
  { 
    id: "7", 
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Leather Boots - Winter Collection",
    price: 159.99,
    rating: 4.9,
    featured: true
  },
];

// Mock new arrivals
const NEW_ARRIVALS = [
  { 
    id: "4", 
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Leather Jacket - Premium Quality",
    price: 199.99,
    rating: 4.7
  },
  { 
    id: "5", 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Sports Shoes - Limited Edition",
    price: 79.99,
    rating: 4.6
  },
  { 
    id: "6", 
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Smart Watch - Health Tracker",
    price: 199.99,
    rating: 4.9
  },
  { 
    id: "8", 
    image: "https://images.unsplash.com/photo-1590739225458-fc88548ba013?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Denim Jacket - Casual Style",
    price: 89.99,
    rating: 4.5
  },
];

interface ProductsGridProps {
  activeTab: string;
  likedProducts: string[];
  toggleLike: (id: string) => void;
}

const ProductsGrid = ({ activeTab, likedProducts, toggleLike }: ProductsGridProps) => {
  const products = activeTab === "featured" ? FEATURED_PRODUCTS : NEW_ARRIVALS;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
            rating={product.rating}
            isLiked={likedProducts.includes(product.id)}
            onToggleLike={toggleLike}
          />
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline" className="bg-transparent border-app-gray-light text-white">
          View More <ChevronDown className="ml-1 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductsGrid;
