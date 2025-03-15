
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export interface StreamProductsProps {
  streamId: string;
  className?: string;
}

const StreamProducts: React.FC<StreamProductsProps> = ({ streamId, className }) => {
  const { data: streamProducts, isLoading } = useQuery({
    queryKey: ['stream-products', streamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('live_stream_products')
        .select(`
          *,
          products (*)
        `)
        .eq('stream_id', streamId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!streamId
  });
  
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="font-semibold">Products</h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!streamProducts || streamProducts.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="font-semibold">Products</h3>
        <p className="text-sm text-gray-500">No products available</p>
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Shop Products</h3>
        <Badge variant="secondary">
          {streamProducts.length} items
        </Badge>
      </div>
      
      <div className="space-y-2">
        {streamProducts.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-2">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-100 mr-3 rounded overflow-hidden">
                  {item.products.image_url && (
                    <img 
                      src={item.products.image_url} 
                      alt={item.products.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.products.name}</p>
                  <div className="flex items-center">
                    <p className="text-sm font-bold text-app-yellow">
                      ${item.discount_percentage 
                        ? (item.products.price * (1 - item.discount_percentage / 100)).toFixed(2)
                        : item.products.price.toFixed(2)
                      }
                    </p>
                    {item.discount_percentage && (
                      <p className="text-xs line-through text-gray-500 ml-2">
                        ${item.products.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                <Link to={`/product/${item.products.id}`}>
                  <Button size="sm" variant="ghost">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StreamProducts;
