
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ShopService from '@/services/shop.service';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import ProductsGrid from '@/components/shop/ProductsGrid';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const decodedCategory = categoryName ? decodeURIComponent(categoryName) : '';
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', 'category', decodedCategory],
    queryFn: () => ShopService.getProducts(decodedCategory),
    enabled: !!decodedCategory,
  });
  
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
        <ProductsGrid products={products} />
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
