
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Search, X } from 'lucide-react';
import ProductsGrid from '@/components/shop/ProductsGrid';
import ShopService from '@/services/shop.service';
import VideoService from '@/services/video.service';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialTab = searchParams.get('tab') || 'products';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['search', 'products', initialQuery],
    queryFn: () => ShopService.searchProducts(initialQuery),
    enabled: !!initialQuery && activeTab === 'products',
  });
  
  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['search', 'videos', initialQuery],
    queryFn: () => VideoService.searchVideos(initialQuery),
    enabled: !!initialQuery && activeTab === 'videos',
  });
  
  useEffect(() => {
    // Update URL when tab changes
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', activeTab);
    setSearchParams(newParams);
  }, [activeTab, searchParams, setSearchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      const newParams = new URLSearchParams();
      newParams.set('q', searchQuery);
      newParams.set('tab', activeTab);
      setSearchParams(newParams);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Search</h1>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, videos, or users"
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <Button type="submit">Search</Button>
        </div>
      </form>
      
      {initialQuery && (
        <>
          <div className="mb-4">
            <p className="text-gray-600">
              Search results for: <span className="font-medium">{initialQuery}</span>
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-6"
          >
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="lives">Live Streams</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              <Separator className="mb-6" />
              
              {productsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {Array(8).fill(null).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg aspect-square mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : products && products.length > 0 ? (
                <ProductsGrid products={products} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found matching your search.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="videos">
              <h2 className="text-xl font-semibold mb-4">Videos</h2>
              <Separator className="mb-6" />
              
              {videosLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {Array(6).fill(null).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg aspect-video mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : videos && videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {videos.map((video) => (
                    <div key={video.id} className="bg-gray-50 rounded-lg p-4">
                      Video result (to be implemented)
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No videos found matching your search.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="users">
              <h2 className="text-xl font-semibold mb-4">Users</h2>
              <Separator className="mb-6" />
              
              <div className="text-center py-12">
                <p className="text-gray-500">User search results will be implemented soon.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="lives">
              <h2 className="text-xl font-semibold mb-4">Live Streams</h2>
              <Separator className="mb-6" />
              
              <div className="text-center py-12">
                <p className="text-gray-500">Live stream search results will be implemented soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {!initialQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500">Enter a search term to find products, videos, and more.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
