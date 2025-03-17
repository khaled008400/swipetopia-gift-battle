
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import shopService from '@/services/shop.service';
import { Product } from '@/types/product.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/shop/ProductCard';
import { Badge } from '@/components/ui/badge';

interface ShopParams {
  shopId: string;
}

const ShopPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [isFollowing, setIsFollowing] = useState(false);
  
  const { data: shop, isLoading: isShopLoading, error: shopError } = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => shopService.getShopById(shopId || '')
  });
  
  const { data: products, isLoading: isProductsLoading, error: productsError } = useQuery({
    queryKey: ['shopProducts', shopId],
    queryFn: () => shopService.getProducts(shopId || '')
  });
  
  useEffect(() => {
    // Load initial favorite states from local storage or server
    // For now, let's initialize them randomly
    if (products) {
      const initialFavorites: { [key: string]: boolean } = {};
      products.forEach((product: Product) => {
        initialFavorites[product.id] = Math.random() > 0.5;
      });
      setFavorites(initialFavorites);
    }
  }, [products]);
  
  if (isShopLoading || isProductsLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }
  
  if (shopError || productsError) {
    return <div className="container mx-auto p-4">Error loading shop or products.</div>;
  }
  
  if (!shop) {
    return <div className="container mx-auto p-4">Shop not found.</div>;
  }

  const toggleFavorite = (id: string) => {
    // Toggle favorite status
    setFavorites(prev => {
      const newFavorites = { ...prev };
      newFavorites[id] = !prev[id];
      return newFavorites;
    });
  };
  
  const handleFollow = () => {
    setIsFollowing(prev => !prev);
  };
  
  return (
    <div className="container mx-auto p-4">
      {/* Shop Header */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Avatar className="w-20 h-20">
            <AvatarImage src={shop?.logo_url || "https://placehold.co/100x100"} alt={shop?.name} />
            <AvatarFallback>{shop?.name?.charAt(0) || 'S'}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <CardTitle className="text-2xl font-semibold">{shop?.name}</CardTitle>
            <CardDescription>{shop?.description}</CardDescription>
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              {shop?.rating ? shop.rating.toFixed(1) : 'No ratings'}
              <span className="text-gray-500 ml-2">({shop?.total_sales || 0} sales)</span>
            </div>
          </div>
          <div className="ml-auto">
            <Button onClick={handleFollow} variant={isFollowing ? "secondary" : "outline"}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-48 rounded-md overflow-hidden">
            <img
              src={shop?.banner_url || "https://placehold.co/800x200"}
              alt="Shop Banner"
              className="object-cover w-full h-full"
            />
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-4" />
      
      {/* Product Listings */}
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product: Product) => (
            <ProductCard
              key={product.id} 
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image_url}
              category={product.category} 
              isFavorite={favorites[product.id] || false}
              toggleFavorite={() => toggleFavorite(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No products available.</div>
      )}
    </div>
  );
};

export default ShopPage;
