
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Search, Filter, ArrowRight, Heart, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-app-black p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <ShoppingBag className="w-6 h-6 mr-2" /> Shop
      </h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-app-gray-dark pl-10 pr-10 border-app-gray-light text-white"
        />
        <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 w-max">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant="outline" 
              className="border-app-gray-light bg-app-gray-dark hover:bg-app-gray-light text-white whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="new">New Arrivals</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="animate-fade-in">
          <div className="space-y-6">
            {FEATURED_PRODUCTS.map((product) => (
              <div key={product.id} className="relative bg-app-gray-dark rounded-xl overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{product.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-app-yellow mr-1 fill-current" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${product.price}</span>
                    <Button className="rounded-full h-10 w-10 p-0 bg-app-yellow text-app-black hover:bg-app-yellow-hover">
                      <ShoppingBag className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                {product.featured && (
                  <div className="absolute top-2 left-2 bg-app-yellow text-app-black text-xs font-bold py-1 px-2 rounded-full">
                    FEATURED
                  </div>
                )}
                <button className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
                  <Heart className="h-5 w-5 text-white" />
                </button>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-6 border-app-gray-light text-gray-400 hover:text-app-yellow hover:border-app-yellow">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </TabsContent>

        <TabsContent value="new" className="animate-fade-in">
          <div className="space-y-6">
            {NEW_ARRIVALS.map((product) => (
              <div key={product.id} className="relative bg-app-gray-dark rounded-xl overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{product.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-app-yellow mr-1 fill-current" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">${product.price}</span>
                    <Button className="rounded-full h-10 w-10 p-0 bg-app-yellow text-app-black hover:bg-app-yellow-hover">
                      <ShoppingBag className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                  NEW
                </div>
                <button className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
                  <Heart className="h-5 w-5 text-white" />
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
  );
};

export default ShopPage;
