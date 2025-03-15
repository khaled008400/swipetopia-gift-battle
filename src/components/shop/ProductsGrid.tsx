
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/services/shop.service';
import { Heart } from 'lucide-react';

export interface ProductsGridProps {
  products: Product[];
  showCategory?: boolean;
  activeTab?: string;
  likedProducts?: string[];
  toggleLike?: (id: string) => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ 
  products, 
  showCategory = true,
  activeTab,
  likedProducts = [],
  toggleLike
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <Card 
          key={product.id} 
          className="overflow-hidden h-full transition-transform hover:scale-[1.02] group relative"
        >
          <Link to={`/product/${product.id}`}>
            <div className="aspect-square relative overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            
            <CardContent className="pt-4 pb-2">
              <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
              {showCategory && product.category && (
                <Badge variant="outline" className="mt-2 text-xs">
                  {product.category}
                </Badge>
              )}
            </CardContent>
            
            <CardFooter className="pt-0 pb-4">
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-app-yellow">
                  ${product.price.toFixed(2)}
                </span>
                {product.stock_quantity === 0 && (
                  <Badge variant="outline" className="bg-red-100 text-red-600 border-red-200">
                    Out of stock
                  </Badge>
                )}
              </div>
            </CardFooter>
          </Link>
          
          {toggleLike && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLike(product.id);
              }}
              className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-md transition-transform hover:scale-110 z-10"
            >
              <Heart 
                className={`w-4 h-4 ${likedProducts.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} 
              />
            </button>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ProductsGrid;
