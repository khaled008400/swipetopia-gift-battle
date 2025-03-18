// ... keep existing imports
import { useNavigate } from "react-router-dom";
import { Share } from "lucide-react";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  // ... keep existing code (state, hooks, and handlers)

  // Fix property access for is_liked
  const toggleLike = () => {
    setProduct(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        is_liked: !prev.is_liked
      };
    });
  };

  // ... keep existing code (handlers and effects)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... keep existing JSX structure */}
            
      {/* Product actions */}
      <div className="flex flex-wrap gap-2 mt-6">
        <Button onClick={addToCart} className="flex-1 bg-app-yellow text-app-black">
          Add to Cart
        </Button>
        <Button variant="outline" className="flex-1" onClick={toggleLike}>
          {product?.is_liked ? "Liked" : "Like"}
        </Button>
        <Button variant="outline" size="icon">
          <Share className="h-4 w-4" />
        </Button>
      </div>
      
      {/* ... keep existing JSX content */}
    </div>
  );
};

export default ProductDetailPage;
