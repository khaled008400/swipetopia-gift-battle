
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MessageSquare, ShoppingBag, Star, Package, Clock } from 'lucide-react';
import ProductsGrid from '@/components/shop/ProductsGrid';
import ShopService from '@/services/shop.service';
import { Product } from '@/types/product.types';

// Define the ExtendedProduct type to match what your component expects
interface ExtendedProduct extends Product {
  // Add any additional properties your component might expect
}

const SellerProfilePage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [seller, setSeller] = useState<any>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setIsLoading(true);
        
        // This would be a real API call in a production app
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockSeller = {
          id: sellerId || '1',
          name: 'Tech Gadgets Store',
          username: 'techgadgets',
          description: 'We sell the latest and greatest tech gadgets at competitive prices.',
          logo: 'https://i.pravatar.cc/150?img=1',
          banner: 'https://picsum.photos/seed/seller1/1200/300',
          followers: 1280,
          rating: 4.8,
          reviewsCount: 324,
          joinedDate: '2022-01-15',
          verifiedSeller: true,
          location: 'San Francisco, CA',
          fulfillmentTime: '1-3 business days',
          returnPolicy: '30 day returns accepted',
          categories: ['Electronics', 'Gadgets', 'Accessories']
        };
        
        setSeller(mockSeller);
      } catch (error) {
        console.error('Error fetching seller data:', error);
        setError('Failed to load seller profile');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load seller profile information',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchSellerProducts = async () => {
      try {
        setIsLoadingProducts(true);
        
        // This would be a real API call in a production app
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Premium Wireless Earbuds',
            description: 'High quality sound with noise cancellation',
            price: 89.99,
            image_url: 'https://i.pravatar.cc/300?img=1',
            category: 'Electronics',
            rating: 4.7,
            reviews_count: 128,
            in_stock: true,
            seller_id: sellerId || '1',
            created_at: '2023-05-12T00:00:00.000Z',
            updated_at: '2023-05-12T00:00:00.000Z'
          },
          {
            id: '2',
            name: 'Smart Watch',
            description: 'Track fitness and notifications on the go',
            price: 159.99,
            image_url: 'https://i.pravatar.cc/300?img=2',
            category: 'Electronics',
            rating: 4.5,
            reviews_count: 96,
            in_stock: true,
            seller_id: sellerId || '1',
            created_at: '2023-06-01T00:00:00.000Z',
            updated_at: '2023-06-01T00:00:00.000Z'
          },
          {
            id: '3',
            name: 'Portable Charger',
            description: '20,000mAh battery pack for all your devices',
            price: 49.99,
            image_url: 'https://i.pravatar.cc/300?img=3',
            category: 'Accessories',
            rating: 4.8,
            reviews_count: 210,
            in_stock: true,
            seller_id: sellerId || '1',
            created_at: '2023-04-22T00:00:00.000Z',
            updated_at: '2023-04-22T00:00:00.000Z'
          },
          {
            id: '4',
            name: 'Wireless Mouse',
            description: 'Ergonomic design for comfortable all-day use',
            price: 29.99,
            image_url: 'https://i.pravatar.cc/300?img=4',
            category: 'Accessories',
            rating: 4.6,
            reviews_count: 154,
            in_stock: true,
            seller_id: sellerId || '1',
            created_at: '2023-03-15T00:00:00.000Z',
            updated_at: '2023-03-15T00:00:00.000Z'
          }
        ];
        
        setSellerProducts(mockProducts);
        
        // Mock some liked products
        setLikedProducts(['2', '4']);
        
      } catch (error) {
        console.error('Error fetching seller products:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load seller products',
        });
      } finally {
        setIsLoadingProducts(false);
      }
    };
    
    fetchSellerData();
    fetchSellerProducts();
  }, [sellerId, toast]);
  
  const toggleLike = (productId: string) => {
    setLikedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full h-40 bg-gray-700 rounded-lg animate-pulse mb-8" />
        <div className="flex items-center mb-8">
          <Skeleton className="w-24 h-24 rounded-full mr-4" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-12 w-full mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error || !seller) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 text-xl">Failed to load seller profile</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Banner */}
      <div 
        className="w-full h-40 md:h-60 rounded-lg mb-8 bg-center bg-cover"
        style={{
          backgroundImage: `url(${seller.banner})`,
          backgroundPosition: 'center',
        }}
      />
      
      {/* Shop Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <Avatar className="w-24 h-24 border-4 border-background">
          <AvatarImage src={seller.logo} />
          <AvatarFallback>{seller.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{seller.name}</h1>
              <p className="text-muted-foreground">@{seller.username}</p>
              
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="font-medium">{seller.rating}</span>
                <span className="text-muted-foreground text-sm ml-1">({seller.reviewsCount} reviews)</span>
                
                {seller.verifiedSeller && (
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                    Verified Seller
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="gap-1">
                <MessageSquare className="h-4 w-4" /> Message
              </Button>
              <Button className="gap-1" size="sm">
                Follow Store
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Shop Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{seller.followers.toLocaleString()}</div>
              <p className="text-muted-foreground text-sm">Followers</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{sellerProducts.length}</div>
              <p className="text-muted-foreground text-sm">Products</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span className="text-2xl font-bold">{seller.rating}</span>
              </div>
              <p className="text-muted-foreground text-sm">Rating</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                <span className="text-lg">Since</span> {new Date(seller.joinedDate).getFullYear()}
              </div>
              <p className="text-muted-foreground text-sm">Member</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Shop Description */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>About the Shop</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{seller.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-start">
              <Package className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Shipping</h4>
                <p className="text-sm text-muted-foreground">{seller.fulfillmentTime}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Returns</h4>
                <p className="text-sm text-muted-foreground">{seller.returnPolicy}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <ShoppingBag className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium">Categories</h4>
                <p className="text-sm text-muted-foreground">{seller.categories.join(', ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Shop Products */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="products">All Products</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="new">New Arrivals</TabsTrigger>
          <TabsTrigger value="sale">On Sale</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-700 rounded-md mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <ProductsGrid 
              products={sellerProducts} 
              likedProducts={likedProducts}
              toggleLike={toggleLike}
            />
          )}
        </TabsContent>
        
        <TabsContent value="featured">
          <div className="text-center py-12 text-muted-foreground">
            No featured products available at this time.
          </div>
        </TabsContent>
        
        <TabsContent value="new">
          <div className="text-center py-12 text-muted-foreground">
            No new arrivals available at this time.
          </div>
        </TabsContent>
        
        <TabsContent value="sale">
          <div className="text-center py-12 text-muted-foreground">
            No sale items available at this time.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerProfilePage;
