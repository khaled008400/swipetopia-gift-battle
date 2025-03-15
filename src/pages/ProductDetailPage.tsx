
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ShoppingCart, Heart, ArrowLeft, Star } from 'lucide-react';
import ShopService from '@/services/shop.service';
import { Product } from '@/services/shop.service';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => ShopService.getProductById(id as string),
    enabled: !!id,
  });

  // Check if product is liked by user
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user || !id) return;
      
      try {
        const likedProductIds = await ShopService.getUserLikedProductIds();
        setIsLiked(likedProductIds.includes(id));
      } catch (error) {
        console.error("Error checking if product is liked:", error);
      }
    };
    
    checkIfLiked();
  }, [user, id]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      original_price: product.original_price
    });
    
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleLike = async () => {
    if (!user) {
      toast.error("Please log in to save products");
      return;
    }

    if (!id) return;
    
    try {
      const result = await ShopService.toggleProductLike(id);
      setIsLiked(result.liked);
      
      if (result.liked) {
        toast.success("Added to favorites");
      } else {
        toast.success("Removed from favorites");
      }
    } catch (error) {
      console.error("Error toggling product like:", error);
      toast.error("Failed to update favorites");
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" onClick={() => navigate('/shop')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-auto object-cover"
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            {/* Add seller info if available */}
            {product.seller && (
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span>Sold by </span>
                <span className="font-medium ml-1">{(product.seller as any).username}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-3">
              <span className="text-2xl font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Fake review stars */}
            <div className="flex items-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-2">(24 reviews)</span>
            </div>
          </div>
          
          <p className="text-gray-700">{product.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {product.category && (
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {product.category}
              </span>
            )}
          </div>
          
          {/* Stock info */}
          <div className="py-2">
            {product.stock_quantity !== undefined && product.stock_quantity > 0 ? (
              <span className="text-green-600">
                In Stock ({product.stock_quantity} available)
              </span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button 
              className="flex-1" 
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button 
              variant="outline" 
              className={`w-12 flex-none ${isLiked ? 'text-red-500 border-red-500' : ''}`}
              onClick={handleToggleLike}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      
      <Separator className="my-12" />
      
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="space-y-4">
          <h3 className="text-xl font-semibold">Product Description</h3>
          <p className="text-gray-700">{product.description}</p>
        </TabsContent>
        
        <TabsContent value="specifications" className="space-y-4">
          <h3 className="text-xl font-semibold">Specifications</h3>
          <Card>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span className="font-medium">{key}</span>
                    <span>{String(value)}</span>
                  </li>
                ))}
                {!product.specifications && (
                  <li>No specifications available</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-4">
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          <Card>
            <CardContent className="p-4 text-center">
              No reviews yet. Be the first to review this product!
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailPage;
