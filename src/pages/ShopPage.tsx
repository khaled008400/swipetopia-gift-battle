
import React, { useState } from "react";
import { Search, Bell, Heart, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// Mock data for the live selling profiles
const LIVE_SELLERS = [
  { id: "1", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "John" },
  { id: "2", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Emma" },
  { id: "3", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Maria" },
  { id: "4", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Sam" },
  { id: "5", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Alex" },
];

// Mock data for shorts
const SHORTS = [
  { id: "1", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "fashionista" },
  { id: "2", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "styleguru" },
  { id: "3", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "trending" },
];

// Mock featured products
const FEATURED_PRODUCTS = [
  { 
    id: "1", 
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=772&h=900&auto=format&fit=crop",
    name: "Red Dress",
    price: 129.99,
    rating: 4.8,
    featured: true
  },
  { 
    id: "2", 
    image: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=772&h=900&auto=format&fit=crop",
    name: "Black Turtleneck",
    price: 89.99,
    rating: 4.6,
    featured: true
  },
  { 
    id: "3", 
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Stylish Sunglasses",
    price: 49.99,
    rating: 4.2,
    featured: true
  },
];

// Mock new arrivals
const NEW_ARRIVALS = [
  { 
    id: "4", 
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Leather Jacket",
    price: 129.99,
    rating: 4.7
  },
  { 
    id: "5", 
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Sports Shoes",
    price: 79.99,
    rating: 4.6
  },
  { 
    id: "6", 
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Smart Watch",
    price: 199.99,
    rating: 4.9
  },
];

// Categories
const CATEGORIES = ["ALL", "MEN", "WOMEN", "DRESS", "KURTA"];

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeTab, setActiveTab] = useState("featured");
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLike = (productId: string) => {
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
        <button className="absolute right-7 top-1/2 transform -translate-y-1/2 text-gray-400">
          <span className="grid grid-cols-2 grid-rows-2 gap-0.5 w-4 h-4">
            <span className="bg-white w-1.5 h-1.5"></span>
            <span className="bg-white w-1.5 h-1.5"></span>
            <span className="bg-white w-1.5 h-1.5"></span>
            <span className="bg-white w-1.5 h-1.5"></span>
          </span>
        </button>
      </div>

      {/* Live selling section */}
      <div className="px-4 mb-4">
        <div className="flex items-center mb-2">
          <Zap className="w-4 h-4 text-white mr-1" />
          <h3 className="text-white font-medium">Live selling</h3>
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-3 py-1">
          {LIVE_SELLERS.map((seller) => (
            <div key={seller.id} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-app-yellow p-1">
                <img 
                  src={seller.avatar} 
                  alt={seller.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shorts section */}
      <div className="px-4 mb-4">
        <div className="flex items-center mb-2">
          <Zap className="w-4 h-4 text-white mr-1" />
          <h3 className="text-white font-medium">Short</h3>
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-3">
          {SHORTS.map((short) => (
            <div key={short.id} className="relative min-w-28 h-40 rounded-xl overflow-hidden">
              <img 
                src={short.thumbnail} 
                alt={short.username} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
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
          New Categories
        </h3>
        <div className="flex overflow-x-auto no-scrollbar space-x-2 py-1">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`py-1 px-4 rounded-full text-sm font-medium min-w-max ${
                activeCategory === category 
                  ? "bg-app-yellow text-app-black" 
                  : "bg-app-gray-dark text-white"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products tabs section */}
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
                <div key={product.id} className="relative rounded-xl overflow-hidden bg-orange-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-medium text-sm">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">${product.price}</span>
                    </div>
                  </div>
                  <button 
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5"
                    onClick={() => toggleLike(product.id)}
                  >
                    <Heart 
                      className={`w-4 h-4 ${likedProducts.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-800"}`} 
                    />
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new" className="animate-fade-in">
            <div className="grid grid-cols-2 gap-3">
              {NEW_ARRIVALS.map((product) => (
                <div key={product.id} className="relative rounded-xl overflow-hidden bg-orange-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-medium text-sm">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">${product.price}</span>
                    </div>
                  </div>
                  <button 
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5"
                    onClick={() => toggleLike(product.id)}
                  >
                    <Heart 
                      className={`w-4 h-4 ${likedProducts.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-800"}`} 
                    />
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopPage;
