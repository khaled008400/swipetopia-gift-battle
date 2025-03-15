import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ShoppingBag, Video, User2, Check, MessageCircle } from "lucide-react";
import ProductsGrid from "@/components/shop/ProductsGrid";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/services/shop.service";

// Extended product with additional fields needed for seller profile
interface ExtendedProduct extends Product {
  rating?: number;
  isLive?: boolean;
  // Ensure status is properly typed to match Supabase schema
  status: "active" | "draft" | "unavailable";
}

const SellerProfilePage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [isFollowing, setIsFollowing] = useState(false);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (!sellerId) return;
      
      setIsLoading(true);
      try {
        // Fetch the seller profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", sellerId)
          .single();
          
        if (profileError) throw profileError;
        setSellerInfo(profileData);
        
        // Fetch the seller's products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("seller_id", sellerId);
          
        if (productsError) throw productsError;
        
        // Add some dummy data for the UI
        const productsWithExtras = productsData.map(product => ({
          ...product,
          rating: Math.floor(Math.random() * 5) + 1,
          isLive: Math.random() > 0.8,
          // Cast the status to the expected type
          status: (product.status || "active") as "active" | "draft" | "unavailable"
        }));
        
        setProducts(productsWithExtras as ExtendedProduct[]);
        
        // Check if the current user is following this seller
        if (user && user.id) {
          const { data: followData, error: followError } = await supabase
            .from("followers")
            .select("*")
            .eq("follower_id", user.id)
            .eq("following_id", sellerId)
            .single();
            
          setIsFollowing(!!followData);
        }
      } catch (error) {
        console.error("Error fetching seller info:", error);
        toast({
          title: "Error",
          description: "Could not load seller information",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSellerInfo();
  }, [sellerId, user, toast]);

  const handleFollow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from("followers")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", sellerId);
      } else {
        // Follow
        await supabase
          .from("followers")
          .insert({
            follower_id: user.id,
            following_id: sellerId
          });
      }
      
      setIsFollowing(!isFollowing);
      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing ? "You've unfollowed this seller" : "You're now following this seller",
      });
      
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      toast({
        title: "Error",
        description: "Could not update follow status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }

  if (!sellerInfo) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Seller Not Found</h2>
        <p className="mb-4">The seller you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/shop")}>
          Back to Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-8">
        <Avatar className="w-24 h-24 border-2 border-app-yellow">
          <AvatarImage src={sellerInfo.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${sellerInfo.username}`} />
          <AvatarFallback>{sellerInfo.username?.substring(0, 2)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0">
              {sellerInfo.shop_name || `${sellerInfo.username}'s Shop`}
            </h1>
            <Button 
              variant={isFollowing ? "outline" : "default"}
              className={isFollowing ? "bg-transparent border-app-yellow text-app-yellow" : "bg-app-yellow text-app-black"}
              onClick={handleFollow}
            >
              {isFollowing ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Following
                </>
              ) : (
                "Follow"
              )}
            </Button>
          </div>
          
          <p className="text-gray-400 mb-3">{sellerInfo.bio || "No bio available"}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-app-yellow" />
              <span>{products.length} Products</span>
            </div>
            <div className="flex items-center">
              <User2 className="h-5 w-5 mr-2 text-app-yellow" />
              <span>{sellerInfo.followers || 0} Followers</span>
            </div>
            {sellerInfo.roles?.includes("streamer") && (
              <div className="flex items-center">
                <Video className="h-5 w-5 mr-2 text-app-yellow" />
                <span>Streamer</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-app-gray-dark">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="streams">Live Streams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          {products.length > 0 ? (
            <ProductsGrid products={products} />
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-400">No products available yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reviews">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Customer Reviews</CardTitle>
                  <Badge variant="outline" className="ml-2">Average: 4.8 ★</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-400">No reviews available yet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="streams">
          <div className="text-center py-8">
            <Video className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-400">No upcoming streams</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerProfilePage;
