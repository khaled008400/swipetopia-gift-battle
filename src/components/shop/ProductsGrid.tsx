
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/services/shop.service';

export interface ProductsGridProps {
  products: any[];
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
        <Link key={product.id} to={`/product/${product.id}`}>
          <Card className="overflow-hidden h-full transition-transform hover:scale-[1.02]">
            <div className="aspect-square relative overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
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
                {/* We can add more functionality here like rating */}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProductsGrid;
