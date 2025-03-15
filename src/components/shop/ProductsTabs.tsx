
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsGrid from "./ProductsGrid";
import ShopService, { Product } from "@/services/shop.service";
import { useToast } from "@/components/ui/use-toast";

interface ProductsTabsProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  likedProducts: string[];
  toggleLike: (id: string) => void;
  products?: Product[];
  searchMode?: boolean;
}

const ProductsTabs = ({ 
  activeTab = "featured", 
  setActiveTab, 
  likedProducts, 
  toggleLike,
  products: providedProducts,
  searchMode = false
}: ProductsTabsProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // If products are provided (search results), don't fetch from API
    if (providedProducts || searchMode) {
      setLoading(false);
      return;
    }
    
    const loadProducts = async () => {
      setLoading(true);
      try {
        // For featured products, use the new getFeaturedProducts method
        const featured = await ShopService.getFeaturedProducts();
        
        // For new arrivals, get all products and sort by created_at date
        const allProducts = await ShopService.getProducts();
        const newArrivals = [...allProducts]
          .filter(p => p.status === 'active')
          .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
          .slice(0, 8);
        
        setFeaturedProducts(featured);
        setNewProducts(newArrivals);
      } catch (error) {
        console.error("Error loading products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [toast, providedProducts, searchMode]);

  // If in search mode, just show the search results grid
  if (searchMode && providedProducts) {
    return (
      <ProductsGrid 
        products={providedProducts}
        likedProducts={likedProducts}
        toggleLike={toggleLike}
      />
    );
  }

  return (
    <div className="px-4 mb-20">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab ? setActiveTab : undefined} 
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-2 mb-6 bg-app-gray-dark">
          <TabsTrigger 
            value="featured" 
            className="data-[state=active]:bg-app-yellow data-[state=active]:text-app-black py-2.5"
          >
            Featured
          </TabsTrigger>
          <TabsTrigger 
            value="new" 
            className="data-[state=active]:bg-app-yellow data-[state=active]:text-app-black py-2.5"
          >
            New Arrivals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="animate-fade-in">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-gray-700 rounded-md mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <ProductsGrid 
              products={featuredProducts}
              activeTab="featured"
              likedProducts={likedProducts}
              toggleLike={toggleLike}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="animate-fade-in">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-gray-700 rounded-md mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : newProducts.length > 0 ? (
            <ProductsGrid 
              products={newProducts}
              activeTab="new"
              likedProducts={likedProducts}
              toggleLike={toggleLike}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No new products available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsTabs;
