
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ShopService from '@/services/shop.service';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Filter, SortAscending, Heart } from 'lucide-react';
import ProductsGrid from '@/components/shop/ProductsGrid';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const decodedCategory = categoryName ? decodeURIComponent(categoryName) : '';
  const { user } = useAuth();
  const { toast } = useToast();
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'category', decodedCategory],
    queryFn: () => ShopService.getProducts(decodedCategory),
    enabled: !!decodedCategory,
  });

  // Fetch user's liked products when component mounts
  useEffect(() => {
    if (user) {
      fetchLikedProducts();
    }
  }, [user]);

  const fetchLikedProducts = async () => {
    if (!user) return;
    
    try {
      const likedProductIds = await ShopService.getUserLikedProductIds();
      setLikedProducts(likedProductIds);
    } catch (error) {
      console.error("Error fetching liked products:", error);
    }
  };

  const toggleLike = async (productId: string) => {
    if (!user) {
      toast({
        description: "Please log in to save products",
        duration: 3000,
      });
      return;
    }

    try {
      const result = await ShopService.toggleProductLike(productId);
      
      if (result.liked) {
        setLikedProducts([...likedProducts, productId]);
        toast({
          description: "Added to favorites",
          duration: 2000,
        });
      } else {
        setLikedProducts(likedProducts.filter(id => id !== productId));
        toast({
          description: "Removed from favorites",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error toggling product like:", error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => window.history.back()} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">
          {decodedCategory || 'Category'}
        </h1>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          {!isLoading && products && (
            <p className="text-gray-500">{products.length} products</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm">
            <SortAscending className="h-4 w-4 mr-2" /> Sort
          </Button>
        </div>
      </div>
      
      <Separator className="mb-8" />
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array(8).fill(null).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg aspect-square mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <ProductsGrid 
          products={products} 
          likedProducts={likedProducts}
          toggleLike={toggleLike}
        />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
          <p className="text-gray-500 mb-6">
            There are no products in this category yet.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
