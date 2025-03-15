
import React, { useEffect, useState } from 'react';
import { ShoppingBag, Plus, X, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface StreamProductsProps {
  streamId: string;
  className?: string;
  isStreamer?: boolean;
}

const StreamProducts: React.FC<StreamProductsProps> = ({ 
  streamId, 
  className = '', 
  isStreamer = false
}) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addItem } = useCart();
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch products from your API
        // For now, we'll simulate with a timeout and dummy data
        setTimeout(() => {
          setProducts([
            {
              id: '1',
              name: 'Limited Edition T-Shirt',
              price: 29.99,
              image_url: 'https://placehold.co/300x300/333/white?text=T-Shirt',
              discount: 15
            },
            {
              id: '2',
              name: 'Premium Headphones',
              price: 149.99,
              image_url: 'https://placehold.co/300x300/333/white?text=Headphones'
            },
            {
              id: '3',
              name: 'Phone Case',
              price: 19.99,
              image_url: 'https://placehold.co/300x300/333/white?text=Case',
              discount: 20
            }
          ]);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching stream products:', error);
        setIsLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive'
        });
      }
    };
    
    fetchProducts();
  }, [streamId, toast]);
  
  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount ? product.price * (1 - product.discount / 100) : product.price,
      image: product.image_url
    });
    
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
      duration: 3000
    });
  };
  
  if (isLoading) {
    return (
      <div className={`${className} p-3`}>
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className={`${className} p-3 text-center`}>
        <ShoppingBag className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-500">No products available</p>
        {isStreamer && (
          <Button size="sm" className="mt-2">
            <Plus className="h-4 w-4 mr-1" /> Add Products
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className={`${className}`}>
      <div className="space-y-3 p-2">
        {products.map((product: any) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="flex h-24">
              <div className="h-full w-24 flex-shrink-0">
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-2">
                <div>
                  <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                  <div className="flex items-center mt-1">
                    <p className="font-bold text-app-yellow">
                      ${product.discount 
                        ? (product.price * (1 - product.discount / 100)).toFixed(2) 
                        : product.price.toFixed(2)}
                    </p>
                    {product.discount && (
                      <>
                        <p className="ml-2 text-xs text-gray-500 line-through">${product.price.toFixed(2)}</p>
                        <Badge className="ml-2 bg-green-500 text-white hover:bg-green-600" variant="secondary">
                          <Percent className="h-3 w-3 mr-1" />
                          {product.discount}%
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => handleAddToCart(product)}>
                    <ShoppingBag className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {isStreamer && (
        <div className="p-2 border-t">
          <Button size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-1" /> Manage Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default StreamProducts;
