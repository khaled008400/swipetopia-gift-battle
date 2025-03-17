
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '@/components/shop/ProductCard';
import productService from '@/services/product.service';
import { Product } from '@/types/product.types';
import { Loader2 } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (category) {
        setIsLoading(true);
        try {
          const productsData = await productService.getProductsByCategory(category);
          setProducts(productsData);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();
  }, [category]);

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Category: {category}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="w-full">
            <ProductCard
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image_url}
              rating={product.rating}
              isLiked={favorites.has(product.id)}
              onToggleLike={() => toggleFavorite(product.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
