import React, { useState } from "react";
import { Search, Bell, Heart, Home, ShoppingBag, User, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "../components/ui/carousel";
import UserVideosCarousel from "../components/UserVideosCarousel";
import { useAuth } from "@/context/auth/AuthContext";

// Mock data for the live selling profiles
const LIVE_SELLERS = [{
  id: "1",
  avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
  name: "John"
}, {
  id: "2",
  avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
  name: "Emma"
}, {
  id: "3",
  avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
  name: "Maria"
}, {
  id: "4",
  avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
  name: "Sam"
}, {
  id: "5",
  avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png",
  name: "Alex"
}];

// Mock data for shorts
const SHORTS = [{
  id: "1",
  thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a",
  username: "fashionista"
}, {
  id: "2",
  thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a",
  username: "styleguru"
}, {
  id: "3",
  thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a",
  username: "trending"
}];

// Mock data for products
const PRODUCTS = [{
  id: "1",
  image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=772&h=900&auto=format&fit=crop",
  name: "Red Dress",
  price: 129.99,
  liked: false
}, {
  id: "2",
  image: "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=772&h=900&auto=format&fit=crop",
  name: "Black Turtleneck",
  price: 89.99,
  liked: false
}];

// User-created videos for swappable section, formatted to match UserVideosCarousel props
const USER_VIDEOS = [
  {
    id: "4",
    title: "Running Tutorial",
    thumbnailUrl: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-a-beautiful-landscape-32807-large.mp4",
    user: {
      id: "user1",
      username: "runner_girl",
      avatarUrl: "/placeholder.svg"
    }
  },
  {
    id: "5",
    title: "Dance Moves",
    thumbnailUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32949-large.mp4",
    user: {
      id: "user2",
      username: "dance_king",
      avatarUrl: "/placeholder.svg"
    }
  },
  {
    id: "6",
    title: "Travel Vlog",
    thumbnailUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-over-a-city-landscape-32746-large.mp4",
    user: {
      id: "user3",
      username: "travel_vlogger",
      avatarUrl: "/placeholder.svg"
    }
  },
  {
    id: "7",
    title: "Cooking Tutorial",
    thumbnailUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-cooking-in-a-pan-5689-large.mp4",
    user: {
      id: "user4",
      username: "chef_master",
      avatarUrl: "/placeholder.svg"
    }
  }
];

const HomePage = () => {
  const { user } = useAuth();
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  
  const toggleLike = (productId: string) => {
    if (likedProducts.includes(productId)) {
      setLikedProducts(likedProducts.filter(id => id !== productId));
    } else {
      setLikedProducts([...likedProducts, productId]);
    }
  };
  
  return <div className="h-full w-full bg-app-black overflow-y-auto pb-16">
      {/* Header with user greeting */}
      <div className="px-4 pt-3 pb-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png" alt="User" className="w-10 h-10 rounded-full border-2 border-app-yellow" />
          <div className="ml-3">
            <h2 className="text-white font-semibold text-lg">Hi, {user ? user.username : "Guest"}</h2>
            <p className="text-gray-400 text-xs">How are you feeling today?</p>
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

      {/* Live selling section */}
      <div className="px-4 mb-4">
        <div className="flex items-center mb-2">
          <Zap className="w-4 h-4 text-white mr-1" />
          <h3 className="text-white font-medium">Popular Live</h3>
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-3 py-1">
          {LIVE_SELLERS.map(seller => <div key={seller.id} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-app-yellow p-1">
                <img src={seller.avatar} alt={seller.name} className="w-full h-full rounded-full object-cover" />
              </div>
            </div>)}
        </div>
      </div>

      {/* Shorts section */}
      <div className="px-4 mb-4">
        <div className="flex items-center mb-2">
          <Zap className="w-4 h-4 text-white mr-1" />
          <h3 className="text-white font-medium">Trending Videos</h3>
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-3">
          {SHORTS.map(short => <div key={short.id} className="relative min-w-28 h-40 rounded-xl overflow-hidden">
              <img src={short.thumbnail} alt={short.username} className="w-full h-full object-cover" />
            </div>)}
        </div>
      </div>

      {/* User Videos Carousel - now showing followed creators */}
      <div className="px-4 mb-4">
        <UserVideosCarousel videos={USER_VIDEOS} title="Following" />
      </div>

      {/* Products grid */}
      
    </div>;
};
export default HomePage;
