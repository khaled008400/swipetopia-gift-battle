
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Search, Filter, ArrowRight, Heart, Star, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// Mock product data
const FEATURED_PRODUCTS = [
  { id: 1, name: "Premium T-Shirt", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.5, featured: true },
  { id: 2, name: "Designer Jeans", price: 89.99, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.8, featured: true },
  { id: 3, name: "Stylish Sunglasses", price: 49.99, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.2, featured: true },
];

const NEW_ARRIVALS = [
  { id: 4, name: "Leather Jacket", price: 129.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.7 },
  { id: 5, name: "Sports Shoes", price: 79.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.6 },
  { id: 6, name: "Smart Watch", price: 199.99, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.9 },
];

// Mock categories
const CATEGORIES = ["Clothing", "Accessories", "Shoes", "Electronics", "Beauty"];

const ShopPage = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  const toggleLike = (productId: number) => {
    if (likedProducts.includes(productId)) {
      setLikedProducts(likedProducts.filter(id => id !== productId));
    } else {
      setLikedProducts([...likedProducts, productId]);
    }
  };

  return (
    <div className="h-full w-full bg-app-black overflow-y-auto pb-16">
      {/* Header with user greeting */}
      <div className="px-4 pt-3 pb-4 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png" 
            alt="User" 
            className="w-10 h-10 rounded-full border-2 border-app-yellow"
          />
          <div className="ml-3">
            <h2 className="text-white font-semibold text-lg">Shop</h2>
            <p className="text-gray-400 text-xs">Find the best products</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-white">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-white">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative px-4 mb-4">
        <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-app-gray-dark pl-10 pr-10 border-app-gray-light text-white rounded-full"
        />
        <Filter className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Categories section */}
      <div className="px-4 mb-4">
        <h3 className="text-white font-medium mb-2 flex items-center">
          <span className="grid grid-cols-2 grid-rows-2 gap-0.5 w-4 h-4 mr-1">
            <span className="bg-white w-1.5 h-1.5"></span>
            <span className="bg-white w-1.5 h-1.5"></span>
            <span className="bg-white w-1.5 h-1.5"></span>
            <span className="bg-white w-1.5 h-1.5"></span>
          </span>
          Categories
        </h3>
        <div className="flex overflow-x-auto no-scrollbar space-x-2 py-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className="py-1 px-4 rounded-full text-sm font-medium min-w-max bg-app-gray-dark text-white hover:bg-app-yellow hover:text-app-black transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs sections */}
      <div className="px-4 mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-6 bg-app-gray-dark">
            <TabsTrigger 
              value="featured" 
              className="data-[state=active]:bg-app-yellow data-[state=active]:text-app-black"
            >
              Featured
            </TabsTrigger>
            <TabsTrigger 
              value="new" 
              className="data-[state=active]:bg-app-yellow data-[state=active]:text-app-black"
            >
              New Arrivals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              {FEATURED_PRODUCTS.map((product) => (
                <div key={product.id} className="relative rounded-xl overflow-hidden bg-app-gray-dark">
                  <div className="h-48 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-app-yellow mr-1 fill-current" />
                        <span className="text-sm text-white">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">${product.price}</span>
                      <Button size="sm" className="rounded-full bg-app-yellow text-app-black hover:bg-app-yellow-hover">
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {product.featured && (
                    <div className="absolute top-2 left-2 bg-app-yellow text-app-black text-xs font-bold py-1 px-2 rounded-full">
                      FEATURED
                    </div>
                  )}
                  <button 
                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                    onClick={() => toggleLike(product.id)}
                  >
                    <Heart className={`h-4 w-4 ${likedProducts.includes(product.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                  </button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-6 border-app-gray-light text-gray-400 hover:text-app-yellow hover:border-app-yellow">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </TabsContent>

          <TabsContent value="new" className="animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              {NEW_ARRIVALS.map((product) => (
                <div key={product.id} className="relative rounded-xl overflow-hidden bg-app-gray-dark">
                  <div className="h-48 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-app-yellow mr-1 fill-current" />
                        <span className="text-sm text-white">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">${product.price}</span>
                      <Button size="sm" className="rounded-full bg-app-yellow text-app-black hover:bg-app-yellow-hover">
                        <ShoppingBag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                    NEW
                  </div>
                  <button 
                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                    onClick={() => toggleLike(product.id)}
                  >
                    <Heart className={`h-4 w-4 ${likedProducts.includes(product.id) ? "fill-red-500 text-red-500" : "text-white"}`} />
                  </button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-6 border-app-gray-light text-gray-400 hover:text-app-yellow hover:border-app-yellow">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopPage;
