import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarIcon, Star, ShoppingBag, Video, MessageSquare, CheckCircle,
  Loader2, Heart, HeartOff, Filter, Clock 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/services/shop.service";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

interface ExtendedProduct extends Product {
  isLive?: boolean;
  rating?: number;
}

const SellerProfilePage = () => {
  const { sellerId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [liveStreams, setLiveStreams] = useState<any[]>([]);
  const [upcomingStreams, setUpcomingStreams] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!sellerId) return;
      
      setLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sellerId)
          .single();
          
        if (profileError) throw profileError;
        
        if (!profileData || !profileData.roles || !profileData.roles.includes('seller')) {
          throw new Error('Seller not found');
        }
        
        setSellerProfile(profileData);
        
        if (user) {
          setIsFollowing(Math.random() > 0.5);
        }
        
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', sellerId);
          
        if (productsError) throw productsError;
        
        if (productsData) {
          const extendedProducts: ExtendedProduct[] = productsData.map(p => ({
            ...p,
            rating: 4.5,
            isLive: Math.random() > 0.7
          }));
          setProducts(extendedProducts);
        }
        
        setLiveStreams([
          {
            id: "live1",
            title: "Summer Collection Preview",
            viewers: 156,
            thumbnail: "https://placehold.co/400x225/333/FFF?text=Live",
            started_at: new Date(Date.now() - 1000 * 60 * 30)
          }
        ]);
        
        setUpcomingStreams([
          {
            id: "upcoming1",
            title: "New Arrivals Showcase",
            scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
            thumbnail: "https://placehold.co/400x225/333/FFF?text=Upcoming"
          },
          {
            id: "upcoming2",
            title: "Weekend Flash Sale",
            scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 48),
            thumbnail: "https://placehold.co/400x225/333/FFF?text=Weekend"
          }
        ]);
        
        setReviews([
          {
            id: "review1",
            username: "shopper123",
            avatar: "https://i.pravatar.cc/150?u=shopper123",
            rating: 5,
            comment: "Great products and fast shipping! The quality exceeded my expectations.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
          },
          {
            id: "review2",
            username: "fashionlover",
            avatar: "https://i.pravatar.cc/150?u=fashionlover",
            rating: 4,
            comment: "Love the style and customer service was very helpful.",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
          },
          {
            id: "review3",
            username: "regular_buyer",
            avatar: "https://i.pravatar.cc/150?u=regular_buyer",
            rating: 5,
            comment: "One of my favorite sellers on the platform. Always finds unique items!",
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
          }
        ]);
        
      } catch (error) {
        console.error("Error fetching seller data:", error);
        toast({
          title: "Error",
          description: "Could not load seller profile. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSellerData();
  }, [sellerId, user]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      description: isFollowing ? "Unfollowed seller" : "Now following seller",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-app-black">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }

  if (!sellerProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-app-black p-4">
        <ShoppingBag className="w-16 h-16 text-app-yellow mb-4" />
        <h1 className="text-xl font-bold mb-2">Seller Not Found</h1>
        <p className="text-gray-400 mb-4 text-center">
          The seller profile you're looking for could not be found.
        </p>
        <Button onClick={() => window.history.back()} className="bg-app-yellow text-app-black">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-black pb-16">
      <div className="bg-app-gray-dark p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-app-yellow">
            <AvatarImage src={sellerProfile.avatar_url} alt={sellerProfile.username} />
            <AvatarFallback className="text-lg">
              {sellerProfile.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold">{sellerProfile.shop_name || sellerProfile.username}</h1>
                <p className="text-gray-400">@{sellerProfile.username}</p>
              </div>
              <Button 
                onClick={toggleFollow}
                variant={isFollowing ? "outline" : "default"}
                className={isFollowing ? "border-app-yellow text-app-yellow" : "bg-app-yellow text-app-black"}
              >
                {isFollowing ? (
                  <>
                    <HeartOff className="h-4 w-4 mr-2" /> Unfollow
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" /> Follow
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex gap-4 mt-2">
              <div className="text-center">
                <div className="font-bold">{products.length}</div>
                <div className="text-xs text-gray-400">Products</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{sellerProfile.followers || 0}</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">4.8</div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {sellerProfile.bio && (
          <p className="mt-3 text-sm">{sellerProfile.bio}</p>
        )}
        
        <div className="flex items-center mt-2">
          <Badge className="bg-green-600 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified Seller
          </Badge>
          {sellerProfile.location && (
            <span className="text-xs text-gray-400 ml-3">{sellerProfile.location}</span>
          )}
        </div>
      </div>

      {liveStreams.length > 0 && (
        <div className="p-4">
          <Card className="bg-app-gray-dark border-app-yellow border overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={liveStreams[0].thumbnail} 
                  alt="Live Stream" 
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-red-500 flex items-center">
                    <span className="animate-pulse h-2 w-2 bg-white rounded-full mr-1"></span> LIVE
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{liveStreams[0].title}</h3>
                      <div className="flex items-center text-sm text-gray-300">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          Started {format(new Date(liveStreams[0].started_at), "h:mm a")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button className="bg-app-yellow text-app-black">
                        Watch Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full p-4 pt-2">
        <TabsList className="w-full bg-app-gray-dark mb-4">
          <TabsTrigger value="products" className="flex-1">
            <ShoppingBag className="h-4 w-4 mr-2" /> Products
          </TabsTrigger>
          <TabsTrigger value="streams" className="flex-1">
            <Video className="h-4 w-4 mr-2" /> Streams
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1">
            <Star className="h-4 w-4 mr-2" /> Reviews
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <ShoppingBag className="h-12 w-12 mb-2" />
              <p>No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="bg-app-gray-dark overflow-hidden">
                  <div className="aspect-square relative">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.isLive && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        <span className="h-2 w-2 bg-white rounded-full animate-pulse mr-1"></span> Live
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-app-yellow font-semibold">${product.price.toFixed(2)}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs ml-1">{(4 + Math.random()).toFixed(1)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="streams">
          <div className="space-y-6">
            {liveStreams.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Live Now</h3>
                <div className="space-y-3">
                  {liveStreams.map(stream => (
                    <Card key={stream.id} className="bg-app-gray-dark overflow-hidden">
                      <div className="relative">
                        <img 
                          src={stream.thumbnail} 
                          alt={stream.title}
                          className="w-full h-40 object-cover"
                        />
                        <Badge className="absolute top-2 left-2 bg-red-500 flex items-center">
                          <span className="animate-pulse h-2 w-2 bg-white rounded-full mr-1"></span> LIVE
                        </Badge>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-black/70 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {stream.viewers}
                          </Badge>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                          <h3 className="font-semibold">{stream.title}</h3>
                          <p className="text-sm text-gray-200">Started {format(new Date(stream.started_at), "h:mm a")}</p>
                        </div>
                      </div>
                      <CardContent className="p-3 flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-400">Featured products: 8</span>
                        </div>
                        <Button size="sm" className="bg-app-yellow text-app-black">
                          Join Stream
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {upcomingStreams.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Upcoming Streams</h3>
                <div className="space-y-3">
                  {upcomingStreams.map(stream => (
                    <Card key={stream.id} className="bg-app-gray-dark overflow-hidden">
                      <div className="relative">
                        <img 
                          src={stream.thumbnail} 
                          alt={stream.title}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                          <h3 className="font-semibold">{stream.title}</h3>
                        </div>
                      </div>
                      <CardContent className="p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-app-yellow" />
                          <span className="text-sm">
                            {format(new Date(stream.scheduled_at), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" className="border-app-yellow text-app-yellow">
                          Set Reminder
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Past Streams</h3>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="bg-app-gray-dark overflow-hidden">
                    <div className="relative">
                      <img 
                        src={`https://placehold.co/400x225/333/FFF?text=Past${i}`}
                        alt={`Past stream ${i}`}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                        <h3 className="font-medium text-sm">Past Stream #{i}</h3>
                      </div>
                    </div>
                    <CardContent className="p-2">
                      <p className="text-xs text-gray-400">
                        {format(new Date(Date.now() - 1000 * 60 * 60 * 24 * i * 2), "MMM d, yyyy")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <div className="space-y-4">
            <div className="bg-app-gray-dark p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-center">4.8</div>
                <div className="flex-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-gray-400">(32 reviews)</span>
                  </div>
                  <div className="mt-2">
                    <Badge className="bg-green-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified Seller
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {reviews.map(review => (
                <Card key={review.id} className="bg-app-gray-dark">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>{review.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.username}</div>
                          <div className="text-xs text-gray-400">
                            {format(new Date(review.date), "MMMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Button variant="outline" className="border-app-yellow text-app-yellow">
                View All Reviews
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerProfilePage;
