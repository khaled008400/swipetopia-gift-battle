
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoFeed from '@/components/VideoFeed';
import TrendingVideosSection from '@/components/TrendingVideosSection';
import PopularLiveSection from '@/components/PopularLiveSection';
import { Video } from '@/types/video.types';
import VideoService from '@/services/video.service';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('following');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchVideos = useCallback(async () => {
    try {
      setIsLoading(true);
      let fetchedVideos: Video[];
      
      if (activeTab === 'following' && user) {
        fetchedVideos = await VideoService.getFollowingVideos(user.id);
      } else {
        fetchedVideos = await VideoService.getForYouVideos();
      }
      
      if (fetchedVideos && fetchedVideos.length > 0) {
        setVideos(fetchedVideos);
      } else if (activeTab === 'following') {
        // If no following videos, fallback to recommended
        const forYouVideos = await VideoService.getForYouVideos();
        setVideos(forYouVideos);
        
        if (!forYouVideos.length) {
          toast({
            title: "No videos found",
            description: "Follow some creators to see their content here",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "Failed to load videos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, user, toast]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleVideoChange = (index: number) => {
    setActiveIndex(index);
  };

  const handleVideoView = async (videoId: string) => {
    try {
      await VideoService.incrementViewCount(videoId);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleRefresh = () => {
    fetchVideos();
    setActiveIndex(0);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-black">
      <Tabs 
        defaultValue="following" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <div className="flex justify-center pt-2 sticky top-0 z-10 bg-black/50 backdrop-blur-sm">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="following" onClick={() => setActiveIndex(0)}>
              Following
            </TabsTrigger>
            <TabsTrigger value="foryou" onClick={() => setActiveIndex(0)}>
              For You
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="following" className="h-full m-0 data-[state=inactive]:hidden">
          {videos.length > 0 ? (
            <VideoFeed 
              videos={videos} 
              activeIndex={activeIndex}
              onVideoChange={handleVideoChange}
              onVideoView={handleVideoView}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white">
              <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
              <p className="text-gray-400 text-center mb-4 px-6">
                Follow some creators to see their videos here
              </p>
              <button
                onClick={() => navigate("/explore")}
                className="px-6 py-2 bg-primary text-white rounded-full"
              >
                Explore Creators
              </button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="foryou" className="h-full m-0 data-[state=inactive]:hidden">
          {videos.length > 0 ? (
            <VideoFeed 
              videos={videos} 
              activeIndex={activeIndex}
              onVideoChange={handleVideoChange}
              onVideoView={handleVideoView}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white">
              <h3 className="text-xl font-semibold mb-2">Loading videos</h3>
              <p className="text-gray-400 text-center mb-4 px-6">
                Please wait while we find some great content for you
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomePage;
