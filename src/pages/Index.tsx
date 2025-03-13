
import { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import { Zap } from "lucide-react";
import { 
  Carousel, 
  CarouselContent,
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "../components/ui/carousel";

const Index = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  
  // Example video data - in a real app, this would come from an API
  const videos = [
    {
      id: "1",
      url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-on-a-video-call-43892-large.mp4",
      user: {
        username: "fashionista",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      },
      description: "Check out my new collection! #fashion #style #trending",
      likes: 1243,
      comments: 89,
      shares: 56
    },
    {
      id: "2",
      url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
      user: {
        username: "makeup_artist",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      },
      description: "New makeup tutorial for the weekend party! #makeup #glam",
      likes: 2467,
      comments: 134,
      shares: 89,
      isLive: true
    },
    {
      id: "3",
      url: "https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-happily-in-a-field-at-sunset-1230-large.mp4",
      user: {
        username: "travel_vibes",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      },
      description: "Sunset vibes in Bali 🌴 #travel #sunset #bali",
      likes: 5698,
      comments: 241,
      shares: 178
    }
  ];

  // User-created videos for swappable section
  const userCreatedVideos = [
    {
      id: "4",
      url: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-a-beautiful-landscape-32807-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516",
      username: "runner_girl"
    },
    {
      id: "5",
      url: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32949-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
      username: "dance_king"
    },
    {
      id: "6",
      url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-over-a-city-landscape-32746-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1488161628813-04466f872be2",
      username: "travel_vlogger"
    },
    {
      id: "7",
      url: "https://assets.mixkit.co/videos/preview/mixkit-man-cooking-in-a-pan-5689-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
      username: "chef_master"
    }
  ];

  // Popular live creators
  const liveCreators = [
    { id: "1", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "John" },
    { id: "2", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Emma" },
    { id: "3", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Maria" },
    { id: "4", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Sam" },
    { id: "5", avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png", name: "Alex" },
  ];

  // Trending videos
  const trendingVideos = [
    { id: "1", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "fashionista" },
    { id: "2", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "styleguru" },
    { id: "3", thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a", username: "trending" },
  ];

  // Detect swipe to change videos
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && activeVideoIndex < videos.length - 1) {
        setActiveVideoIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && activeVideoIndex > 0) {
        setActiveVideoIndex(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeVideoIndex, videos.length]);

  return (
    <div className="h-full w-full overflow-hidden">
      {/* Popular Live Section */}
      <div className="absolute top-4 left-0 right-0 px-4 z-20">
        <div className="flex items-center mb-2">
          <Zap className="w-4 h-4 text-white mr-1" />
          <h3 className="text-white font-medium">Popular Live</h3>
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-3 py-1">
          {liveCreators.map((creator) => (
            <div key={creator.id} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-app-yellow p-1">
                <img 
                  src={creator.avatar} 
                  alt={creator.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-white text-xs mt-1">{creator.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Videos Section */}
      <div className="absolute top-32 left-0 right-0 px-4 z-20">
        <div className="flex items-center mb-2">
          <Zap className="w-4 h-4 text-white mr-1" />
          <h3 className="text-white font-medium">Trending Videos</h3>
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-3">
          {trendingVideos.map((video) => (
            <div key={video.id} className="relative min-w-28 h-40 rounded-xl overflow-hidden">
              <img 
                src={video.thumbnail} 
                alt={video.username} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                <span className="text-white text-xs">@{video.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Created Videos - Swappable Carousel */}
      <div className="absolute top-80 left-0 right-0 px-4 z-20">
        <div className="flex items-center mb-2">
          <Zap className="w-4 h-4 text-white mr-1" />
          <h3 className="text-white font-medium">User Videos</h3>
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {userCreatedVideos.map((video) => (
              <CarouselItem key={video.id} className="basis-2/3">
                <div className="relative h-40 rounded-xl overflow-hidden">
                  <video 
                    src={video.url}
                    className="h-full w-full object-cover" 
                    poster={video.thumbnail}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="text-white text-xs">@{video.username}</span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-app-yellow/80 text-app-black" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-app-yellow/80 text-app-black" />
        </Carousel>
      </div>

      {/* Video Feed */}
      <div 
        className="h-full flex flex-col transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${activeVideoIndex * 100}%)` }}
      >
        {videos.map((video, index) => (
          <div key={video.id} className="h-full w-full flex-shrink-0">
            <VideoPlayer 
              video={video} 
              isActive={index === activeVideoIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
