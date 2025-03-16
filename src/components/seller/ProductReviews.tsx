
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, Star, MessageCircle, AlertCircle, CheckCircle, SearchIcon
} from "lucide-react";
import { ProductReview, Product } from "@/types/product.types";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogClose 
} from "@/components/ui/dialog";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";

interface ReviewResponseFormProps {
  reviewId: string;
  existingResponse?: string;
  onSubmit: (reviewId: string, response: string) => Promise<void>;
}

const ReviewResponseForm = ({ reviewId, existingResponse, onSubmit }: ReviewResponseFormProps) => {
  const [response, setResponse] = useState(existingResponse || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!response.trim()) return;
    
    setSubmitting(true);
    await onSubmit(reviewId, response);
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Write your response to this review..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        rows={4}
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={!response.trim() || submitting}
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit Response
        </Button>
      </div>
    </div>
  );
};

const ProductReviews = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<(ProductReview & { product_name: string, seller_response?: string })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    if (user?.id) {
      fetchProducts();
      fetchReviews();
    }
  }, [user]);
  
  const fetchProducts = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id);
        
      if (error) throw error;
      
      if (data) {
        setProducts(data);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
    }
  };
  
  const fetchReviews = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          profiles:user_id (username, avatar_url),
          products:product_id (name),
          review_responses:id (content)
        `)
        .eq('products.seller_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const formattedReviews = data.map((review: any) => ({
          ...review,
          username: review.profiles?.username || "Customer",
          avatar_url: review.profiles?.avatar_url,
          product_name: review.products?.name || "Unknown Product",
          seller_response: review.review_responses?.[0]?.content
        }));
        
        setReviews(formattedReviews);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching reviews",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const respondToReview = async (reviewId: string, response: string) => {
    if (!user?.id) return;
    
    try {
      // Check if response already exists
      const { data: existingData, error: existingError } = await supabase
        .from('review_responses')
        .select('id')
        .eq('review_id', reviewId)
        .eq('seller_id', user.id);
        
      if (existingError) throw existingError;
      
      if (existingData && existingData.length > 0) {
        // Update existing response
        const { error } = await supabase
          .from('review_responses')
          .update({ 
            content: response,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData[0].id);
          
        if (error) throw error;
      } else {
        // Create new response
        const { error } = await supabase
          .from('review_responses')
          .insert({
            review_id: reviewId,
            seller_id: user.id,
            content: response,
            created_at: new Date().toISOString()
          });
          
        if (error) throw error;
      }
      
      // Update local state
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, seller_response: response }
            : review
        )
      );
      
      toast({
        title: "Response submitted",
        description: "Your response has been saved."
      });
    } catch (error: any) {
      toast({
        title: "Error saving response",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const reportReview = async (reviewId: string, reason: string) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
        .from('review_reports')
        .insert({
          review_id: reviewId,
          seller_id: user.id,
          reason,
          created_at: new Date().toISOString(),
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "Review reported",
        description: "Your report has been submitted for review."
      });
    } catch (error: any) {
      toast({
        title: "Error reporting review",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
      />
    ));
  };
  
  const getFilteredReviews = () => {
    return reviews.filter(review => {
      // Filter by product
      if (selectedProductId !== "all" && review.product_id !== selectedProductId) {
        return false;
      }
      
      // Filter by tab
      if (activeTab === "responded" && !review.seller_response) {
        return false;
      }
      if (activeTab === "unresponded" && review.seller_response) {
        return false;
      }
      if (activeTab === "positive" && review.rating < 4) {
        return false;
      }
      if (activeTab === "negative" && review.rating >= 3) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          review.comment.toLowerCase().includes(searchLower) ||
          review.product_name.toLowerCase().includes(searchLower) ||
          (review.username && review.username.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }
  
  const filteredReviews = getFilteredReviews();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="responded">Responded</TabsTrigger>
            <TabsTrigger value="unresponded">Unresponded</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search reviews..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="bg-app-gray-dark border border-gray-600 rounded px-3 py-2 text-sm"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="all">All Products</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <MessageCircle className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">No reviews found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Posted {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">For: </span>
                      <span className="font-medium">{review.product_name}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">By: </span>
                      <span className="font-medium">{review.username}</span>
                    </div>
                    
                    <div className="mt-2 bg-app-gray-dark p-3 rounded">
                      <p className="text-sm">{review.comment}</p>
                    </div>
                    
                    {review.seller_response && (
                      <div className="mt-2 bg-gray-800 p-3 rounded border-l-2 border-app-yellow">
                        <p className="text-xs text-muted-foreground mb-1">Your response:</p>
                        <p className="text-sm">{review.seller_response}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          {review.seller_response ? "Edit Response" : "Respond"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Respond to Review</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Product</p>
                            <p className="font-medium">{review.product_name}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Rating</p>
                            <div className="flex mt-1">{renderStars(review.rating)}</div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Review</p>
                            <div className="p-3 bg-app-gray-dark rounded mt-1">
                              <p className="text-sm">{review.comment}</p>
                            </div>
                          </div>
                          
                          <ReviewResponseForm 
                            reviewId={review.id}
                            existingResponse={review.seller_response}
                            onSubmit={respondToReview}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-400">
                          Report
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report Review</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm">
                            If this review violates our community guidelines, you can report it for review.
                          </p>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Reason for reporting</p>
                            <Textarea 
                              id="report-reason" 
                              placeholder="Please explain why this review should be removed..."
                              rows={4}
                            />
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="destructive" onClick={() => {
                              const reason = (document.getElementById('report-reason') as HTMLTextAreaElement)?.value;
                              if (reason) {
                                reportReview(review.id, reason);
                              }
                            }}>
                              Submit Report
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
