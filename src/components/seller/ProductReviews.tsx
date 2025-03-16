
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Flag, MessageSquare, Star, Filter } from "lucide-react";
import { format } from "date-fns";
import { ProductReview } from "@/types/product.types";
import { supabase } from "@/lib/supabase";

const ProductReviews = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ProductReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<ProductReview | null>(null);
  const [responseText, setResponseText] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterProduct, setFilterProduct] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    if (user?.id) {
      fetchReviews();
      fetchProducts();
    }
  }, [user]);
  
  useEffect(() => {
    applyFilters();
  }, [reviews, filterRating, filterProduct]);
  
  const fetchReviews = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch reviews from the database
      // For now, we'll create mock data
      const mockReviews: ProductReview[] = [
        {
          id: "review-1",
          product_id: "product-1",
          user_id: "user-1",
          rating: 5,
          comment: "Excellent product! Exactly as described and arrived earlier than expected. The quality is outstanding and I would definitely recommend it to others.",
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          username: "JohnDoe",
          avatar_url: "https://i.pravatar.cc/150?u=johndoe",
        },
        {
          id: "review-2",
          product_id: "product-2",
          user_id: "user-2",
          rating: 3,
          comment: "The product is okay, but not as great as I expected based on the description. It works for what I need it for, but I probably wouldn't buy it again.",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          username: "JaneSmith",
          avatar_url: "https://i.pravatar.cc/150?u=janesmith",
        },
        {
          id: "review-3",
          product_id: "product-1",
          user_id: "user-3",
          rating: 1,
          comment: "Very disappointed with this purchase. The product broke after just a few days of use. Would not recommend to anyone.",
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          username: "SamWilson",
          avatar_url: "https://i.pravatar.cc/150?u=samwilson",
        },
        {
          id: "review-4",
          product_id: "product-3",
          user_id: "user-4",
          rating: 4,
          comment: "Great product for the price. The only reason I'm not giving it 5 stars is because the color is slightly different than what was shown in the photos.",
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          username: "EmilyJohnson",
          avatar_url: "https://i.pravatar.cc/150?u=emilyjohnson",
        },
        {
          id: "review-5",
          product_id: "product-4",
          user_id: "user-5",
          rating: 5,
          comment: "Absolutely love this product! It exceeded my expectations in every way. Will definitely purchase from this seller again.",
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          username: "MichaelBrown",
          avatar_url: "https://i.pravatar.cc/150?u=michaelbrown",
        },
      ];
      
      setReviews(mockReviews);
      setFilteredReviews(mockReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Could not load reviews. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchProducts = async () => {
    try {
      // In a real app, this would fetch products from the database
      // For now, we'll create mock data
      const mockProducts = [
        {
          id: "product-1",
          name: "Premium Leather Wallet",
        },
        {
          id: "product-2",
          name: "Cotton T-Shirt",
        },
        {
          id: "product-3",
          name: "Bluetooth Headphones",
        },
        {
          id: "product-4",
          name: "Smart Watch",
        },
      ];
      
      setProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...reviews];
    
    if (filterRating !== null) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }
    
    if (filterProduct) {
      filtered = filtered.filter(review => review.product_id === filterProduct);
    }
    
    setFilteredReviews(filtered);
  };
  
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Unknown Product";
  };
  
  const handleViewReview = (review: ProductReview) => {
    setSelectedReview(review);
    setResponseText("");
  };
  
  const handleSubmitResponse = async () => {
    if (!selectedReview || !responseText.trim()) {
      toast({
        title: "Response required",
        description: "Please provide a response to this review.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // In a real app, this would send a request to the backend to save the response
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Response submitted",
        description: "Your response to the review has been submitted.",
      });
      
      // Clear selected review
      setSelectedReview(null);
      setResponseText("");
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error",
        description: "Failed to submit response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReportReview = async (reviewId: string) => {
    try {
      // In a real app, this would send a request to the backend to report the review
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Review reported",
        description: "The review has been reported and will be reviewed by our team.",
      });
    } catch (error) {
      console.error("Error reporting review:", error);
      toast({
        title: "Error",
        description: "Failed to report review. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Product Reviews</CardTitle>
          <div className="flex gap-2">
            <select
              value={filterRating !== null ? filterRating.toString() : ""}
              onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
              className="bg-app-gray-dark text-white border border-app-gray-light rounded-md px-2 py-1"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="bg-app-gray-dark text-white border border-app-gray-light rounded-md px-2 py-1"
            >
              <option value="">All Products</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviews found matching your filters
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      {format(new Date(review.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={review.avatar_url} />
                          <AvatarFallback>{review.username?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{review.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getProductName(review.product_id)}</TableCell>
                    <TableCell>
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="truncate max-w-[200px]">
                        {review.comment}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewReview(review)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleReportReview(review.id)}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {selectedReview && (
        <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Review Details</DialogTitle>
              <DialogDescription>
                View and respond to this customer review
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={selectedReview.avatar_url} />
                    <AvatarFallback>{selectedReview.username?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedReview.username}</p>
                    <p className="text-sm text-gray-400">
                      {format(new Date(selectedReview.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {renderStars(selectedReview.rating)}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Product</p>
                <p className="text-gray-400">{getProductName(selectedReview.product_id)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Review</p>
                <div className="p-3 bg-app-gray-dark rounded-md">
                  {selectedReview.comment}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Your Response</p>
                <Textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Respond to this customer review..."
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSelectedReview(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitResponse}
                disabled={isSubmitting || !responseText.trim()}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                Submit Response
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductReviews;
