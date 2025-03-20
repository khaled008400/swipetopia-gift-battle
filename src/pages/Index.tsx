
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoFeed from '@/components/VideoFeed';
import { Video } from '@/types/video.types';
import VideoService from '@/services/video.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Index: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching videos for Index page");
        const fetchedVideos = await VideoService.getForYouVideos();
        console.log(`Fetched ${fetchedVideos.length} videos for Index page`);
        
        if (fetchedVideos.length > 0) {
          setVideos(fetchedVideos);
        } else {
          toast({
            title: "No videos found",
            description: "There are no videos to display right now",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast({
          title: "Error",
          description: "Could not load videos. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [toast]);

  const handleVideoView = async (videoId: string) => {
    try {
      await VideoService.incrementViewCount(videoId);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleVideoChange = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="h-full w-full bg-black">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="text-white mt-4">Loading videos...</p>
        </div>
      ) : videos.length > 0 ? (
        <VideoFeed
          videos={videos}
          activeIndex={activeIndex}
          onVideoChange={handleVideoChange}
          onVideoView={handleVideoView}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <p>No videos available</p>
        </div>
      )}
    </div>
  );
};

export default Index;
