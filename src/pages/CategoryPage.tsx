
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';
import { Product } from '@/types/product.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/shop/ProductCard';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Define params as a Record to satisfy the constraint
const CategoryPage: React.FC = () => {
  const params = useParams<{ categoryName: string }>();
  const categoryName = params.categoryName || '';
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products, isLoading: isProductsLoading, error: productsError } = useQuery({
    queryKey: ['categoryProducts', categoryName],
    queryFn: () => productService.getProductsByCategory(categoryName)
  });

  useEffect(() => {
    if (products) {
      const initialFavorites: { [key: string]: boolean } = {};
      products.forEach((product: Product) => {
        initialFavorites[product.id] = Math.random() > 0.5;
      });
      setFavorites(initialFavorites);
    }
  }, [products]);

  if (isProductsLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (productsError) {
    return <div className="container mx-auto p-4">Error loading products.</div>;
  }

  if (!products) {
    return <div className="container mx-auto p-4">No products found.</div>;
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = { ...prev };
      newFavorites[id] = !prev[id];
      return newFavorites;
    });
  };

  const handleFollow = () => {
    setIsFollowing(prev => !prev);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Category Header */}
      <Card className="mb-6">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 pb-2">
          <Avatar className="w-16 h-16">
            <AvatarImage src={"https://placehold.co/100x100"} alt={categoryName} />
            <AvatarFallback>{categoryName?.charAt(0) || 'C'}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <CardTitle className="text-2xl font-semibold">{categoryName}</CardTitle>
            <CardDescription>Explore our wide range of products in the {categoryName} category.</CardDescription>
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              {/* Category rating or other relevant info can be added here */}
              No ratings available
            </div>
          </div>
          <div className="md:ml-auto w-full md:w-auto">
            <Button onClick={handleFollow} variant={isFollowing ? "secondary" : "outline"} className="w-full md:w-auto">
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-48 rounded-md overflow-hidden">
            <img
              src={"https://placehold.co/800x200"}
              alt="Category Banner"
              className="object-cover w-full h-full"
            />
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      {/* Search Input */}
      <div className="mb-4">
        <Label htmlFor="search">Search Products</Label>
        <Input
          type="text"
          id="search"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Product Listings */}
      <h2 className="text-xl font-semibold mb-4">Products in {categoryName}</h2>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image_url}
              isFavorite={favorites[product.id] || false}
              toggleFavorite={() => toggleFavorite(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No products available in this category.</div>
      )}
    </div>
  );
};

export default CategoryPage;
