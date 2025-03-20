
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoFeed from '@/components/VideoFeed';
import { Video } from '@/types/video.types';
import VideoService from '@/services/video';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, RefreshCw } from 'lucide-react';

const Index: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching videos for Index page (attempt " + (retryCount + 1) + ")");
        
        // First try to get For You videos
        let fetchedVideos = await VideoService.getForYouVideos();
        console.log(`Fetched ${fetchedVideos.length} videos for For You feed`);
        
        // If no videos are returned, try Trending videos as fallback
        if (fetchedVideos.length === 0) {
          console.log("No For You videos found, trying trending videos instead");
          fetchedVideos = await VideoService.getTrendingVideos();
          console.log(`Fetched ${fetchedVideos.length} trending videos as fallback`);
        }
        
        // If still no videos, try getting any videos
        if (fetchedVideos.length === 0) {
          console.log("No trending videos found, trying any public videos");
          fetchedVideos = await VideoService.getVideos(20);
          console.log(`Fetched ${fetchedVideos.length} generic videos as last resort`);
        }
        
        if (fetchedVideos.length > 0) {
          console.log("Setting videos in state:", fetchedVideos.length);
          setVideos(fetchedVideos);
          setLoadError(null);
        } else {
          console.log("No videos found in any feed");
          setLoadError("No videos found");
          toast({
            title: "No videos found",
            description: "There are no videos to display right now",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching videos:", error);
        setLoadError(error.message || "Could not load videos");
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
  }, [toast, retryCount]);

  const handleRefresh = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleVideoView = async (videoId: string) => {
    try {
      await VideoService.incrementViewCount(videoId);
      console.log("View count incremented for video:", videoId);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleVideoChange = (index: number) => {
    setActiveIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
        <p className="text-white mt-4">Loading videos...</p>
      </div>
    );
  }

  if (loadError || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white">
        <p className="mb-4 text-xl">{loadError || "No videos available"}</p>
        <button 
          className="flex items-center px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
          onClick={handleRefresh}
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black">
      <VideoFeed
        videos={videos}
        activeIndex={activeIndex}
        onVideoChange={handleVideoChange}
        onVideoView={handleVideoView}
      />
    </div>
  );
};

export default Index;
