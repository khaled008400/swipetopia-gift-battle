
import { Zap } from "lucide-react";
import { 
  Carousel, 
  CarouselContent,
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "./ui/carousel";

interface UserCreatedVideo {
  id: string;
  url: string;
  thumbnail: string;
  username: string;
}

interface UserVideosCarouselProps {
  videos: UserCreatedVideo[];
}

const UserVideosCarousel = ({ videos }: UserVideosCarouselProps) => {
  return (
    <div className="absolute top-80 left-0 right-0 px-4 z-20">
      <div className="flex items-center mb-2">
        <Zap className="w-4 h-4 text-white mr-1" />
        <h3 className="text-white font-medium">User Videos</h3>
      </div>
      <Carousel className="w-full">
        <CarouselContent>
          {videos.map((video) => (
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
