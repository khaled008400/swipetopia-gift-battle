
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.types";
import { useToast } from "@/components/ui/use-toast";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch product data from your API or Supabase
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
        // Initialize like state based on user's previous interaction if available
        setIsLiked(!!data.is_liked);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "Error",
          description: "Could not load product details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  // Toggle like state
  const toggleLike = () => {
    setIsLiked(prev => !prev);
  };

  const addToCart = () => {
    if (!product) return;
    
    // Implement cart functionality
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden">
          <img 
            src={product.image_url || "/placeholder.svg"} 
            alt={product.name} 
            className="w-full h-auto object-cover"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-gray-600">{product.description}</p>
            
          {/* Product actions */}
          <div className="flex flex-wrap gap-2 mt-6">
            <Button onClick={addToCart} className="flex-1 bg-app-yellow text-app-black">
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1" onClick={toggleLike}>
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button variant="outline" size="icon">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
