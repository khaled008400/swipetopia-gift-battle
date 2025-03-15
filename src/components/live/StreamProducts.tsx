import React, { useState, useEffect } from 'react';
import { ShoppingBag, Tag, X, Star, Percent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { StreamProductService } from '@/services/streaming';
import { useAuth } from '@/context/AuthContext';

interface StreamProductsProps {
  streamId: string;
  isStreamer?: boolean;
}

const StreamProducts = ({ streamId, isStreamer = false }: StreamProductsProps) => {
  const [products, setProducts] = useState<StreamProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch tagged products
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const streamProducts = await StreamProductService.getStreamProducts(streamId);
        setProducts(streamProducts);
      } catch (error) {
        console.error('Error fetching stream products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products for this stream',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Subscribe to real-time updates for product tags
    const channel = supabase
      .channel('stream-products')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'live_stream_products',
          filter: `stream_id=eq.${streamId}`
        },
        () => {
          // Refresh the product list when changes occur
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamId, toast]);

  const handleRemoveProduct = async (streamProductId: string) => {
    try {
      await StreamProductService.removeProductTag(streamProductId);
      setProducts(products.filter(p => p.id !== streamProductId));
      toast({
        title: 'Product removed',
        description: 'Product has been removed from the stream'
      });
    } catch (error) {
      console.error('Error removing product:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove product from stream',
        variant: 'destructive'
      });
    }
  };

  const toggleFeatured = async (streamProductId: string, currentFeatured: boolean) => {
    try {
      await StreamProductService.updateStreamProduct(streamProductId, { featured: !currentFeatured });
      toast({
        title: currentFeatured ? 'Product unfeatured' : 'Product featured',
        description: `Product has been ${currentFeatured ? 'unfeatured' : 'featured'}`
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product status',
        variant: 'destructive'
      });
    }
  };

  const initiateCheckout = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to purchase products',
        variant: 'destructive'
      });
      return;
    }

    try {
      const product = products.find(p => p.product_id === productId);
      if (!product?.product) return;

      // Find product from products array
      const amount = Math.round(product.product.price * 100); // Convert to cents for Stripe

      // Create payment intent via edge function
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { 
          amount, 
          productId, 
          streamId 
        }
      });

      if (error) throw error;

      // Redirect to checkout page with client secret
      window.location.href = `/checkout?clientSecret=${data.clientSecret}&productId=${productId}&streamId=${streamId}`;
      
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast({
        title: 'Checkout error',
        description: 'Failed to initiate checkout process',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-app-yellow"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-4 text-gray-400 text-sm">
        <ShoppingBag className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p>No products available in this stream</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-1">
      {products.map((streamProduct) => (
        <Card key={streamProduct.id} className={`p-2 flex items-center ${streamProduct.featured ? 'border-app-yellow' : ''}`}>
          {streamProduct.product?.image_url && (
            <img 
              src={streamProduct.product.image_url} 
              alt={streamProduct.product?.name} 
              className="w-12 h-12 object-cover rounded-md mr-3" 
            />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h4 className="font-medium text-sm truncate">{streamProduct.product?.name}</h4>
              {streamProduct.featured && (
                <Badge variant="outline" className="ml-2 bg-app-yellow/20 text-app-yellow text-xs">
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex items-center mt-1">
              <span className="text-app-yellow font-bold text-sm">
                ${streamProduct.product?.price.toFixed(2)}
              </span>
              
              {streamProduct.discount_percentage && (
                <Badge className="ml-2 bg-green-500 text-white text-xs">
                  {streamProduct.discount_percentage}% OFF
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            {isStreamer ? (
              <>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8" 
                  onClick={() => toggleFeatured(streamProduct.id, !!streamProduct.featured)}
                >
                  <Star className={`h-4 w-4 ${streamProduct.featured ? 'fill-app-yellow text-app-yellow' : 'text-gray-400'}`} />
                </Button>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-red-500" 
                  onClick={() => handleRemoveProduct(streamProduct.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                className="bg-app-yellow text-black hover:bg-app-yellow/80"
                onClick={() => initiateCheckout(streamProduct.product_id)}
              >
                Buy Now
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StreamProducts;
