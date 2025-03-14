import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "./ui/carousel";
import { useAuth } from "../context/auth/AuthContext";

interface UserVideosCarouselProps {
  videos?: {
    id: string;
    title: string;
    thumbnailUrl: string;
    videoUrl: string;
    user: {
      id: string;
      username: string;
      avatarUrl: string;
    };
  }[];
  userId?: string;
  title?: string;
}

const UserVideosCarousel: React.FC<UserVideosCarouselProps> = ({ videos = [], title }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { user } = useAuth();

  const handlePrev = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {title && (
        <h3 className="text-white font-medium mb-2">{title}</h3>
      )}
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent className="overflow-hidden">
          {videos.map((video, index) => (
            <CarouselItem key={video.id} className={`pl-1 pr-1 md:pl-2 md:pr-2 w-full ${index === currentVideoIndex ? 'opacity-100' : 'opacity-50'}`}>
              <div className="p-1">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="object-cover rounded-md aspect-video"
                />
                <h3 className="text-sm font-semibold mt-2">{video.title}</h3>
                <p className="text-xs text-gray-400">Uploaded by {video.user.username}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 top-1/2 transform -translate-y-1/2 absolute z-10 bg-black/20 text-white rounded-full p-1" onClick={handlePrev}>
          <ArrowLeft className="h-4 w-4" />
        </CarouselPrevious>
        <CarouselNext className="right-2 top-1/2 transform -translate-y-1/2 absolute z-10 bg-black/20 text-white rounded-full p-1" onClick={handleNext}>
          <ArrowRight className="h-4 w-4" />
        </CarouselNext>
      </Carousel>
    </div>
  );
};

export default UserVideosCarousel;
