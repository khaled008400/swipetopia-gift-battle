
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types/product.types';
import ShopService from '@/services/shop.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => ShopService.getProductById(productId || ''),
    enabled: !!productId,
  });

  useEffect(() => {
    // Simulate fetching favorite status from local storage or API
    // Replace with actual logic
    setIsFavorite(false); // Default to false
  }, [productId]);

  const toggleFavorite = () => {
    setIsFavorite(prevState => !prevState);
  };

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (error || !product) {
    return <div>Error loading product details.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <img src={product.image_url} alt={product.name} className="rounded-md" />
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold">${product.price}</div>
              <Button onClick={toggleFavorite} variant="outline">
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Product Details</h3>
              <p>Category: {product.category}</p>
              <p>Stock Quantity: {product.stock_quantity}</p>
              <p>Status: {product.status}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Add to Cart</Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        <div className="space-y-4">
          {/* Example Review */}
          <Card>
            <CardHeader className="flex flex-row items-center">
              <Avatar className="w-8 h-8 mr-2">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <CardTitle className="text-sm font-medium">John Doe</CardTitle>
              <div className="ml-auto flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                <span>4.5</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Great product! Highly recommend.
              </p>
            </CardContent>
          </Card>
          {/* Add more reviews here */}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Add a Review</h2>
        <Card>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="rating">Rating</Label>
              <Input type="number" id="rating" placeholder="Enter rating (1-5)" />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="comment">Comment</Label>
              <Textarea id="comment" placeholder="Write your review here" />
            </div>
            <Button>Submit Review</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
