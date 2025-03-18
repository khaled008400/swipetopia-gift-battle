
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
        const fetchedVideos = await VideoService.getForYouVideos();
        setVideos(fetchedVideos);
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
      {videos.length > 0 && (
        <VideoFeed
          videos={videos}
          activeIndex={activeIndex}
          onVideoChange={handleVideoChange}
          onVideoView={handleVideoView}
        />
      )}
    </div>
  );
};

export default Index;
