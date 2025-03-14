import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { 
  Carousel, 
  CarouselContent,
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "./ui/carousel";
import { useAuth } from "../context/auth/AuthContext";

interface UserCreatedVideo {
  id: string;
  url: string;
  thumbnail: string;
  username: string;
  isFollowing?: boolean;
}

interface UserVideosCarouselProps {
  videos: UserCreatedVideo[];
  title?: string;
}

const UserVideosCarousel = ({ videos, title = "Following" }: UserVideosCarouselProps) => {
  const { user } = useAuth();
  const [followingVideos, setFollowingVideos] = useState<UserCreatedVideo[]>([]);
  
  useEffect(() => {
    // In a real app, we would fetch videos from followed creators from an API
    // For now, we'll filter videos that have isFollowing = true or simulate a following state
    const filteredVideos = videos.filter(video => 
      video.isFollowing || // If we have explicit following information
      (user && Math.random() > 0.3) // Randomly mark some videos as from followed creators for demo
    );
    
    setFollowingVideos(filteredVideos);
  }, [videos, user]);

  if (followingVideos.length === 0) {
    return (
      <div className="my-4">
        <div className="flex items-center mb-2">
          <Zap className="w-4 h-4 text-white mr-1" />
          <h3 className="text-white font-medium">{title}</h3>
        </div>
        <div className="bg-app-gray-dark rounded-lg p-4 text-center text-gray-400">
          {user ? "No videos from creators you follow yet" : "Sign in to see videos from creators you follow"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-2">
        <Zap className="w-4 h-4 text-white mr-1" />
        <h3 className="text-white font-medium">{title}</h3>
      </div>
      <Carousel className="w-full">
        <CarouselContent>
          {followingVideos.map((video) => (
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
  );
};

export default UserVideosCarousel;
