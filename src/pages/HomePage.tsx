
import React, { useState, useEffect, useCallback } from 'react';
import VideoFeed from '@/components/VideoFeed';
import VideoService from '@/services/video';
import { ChevronDown, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Video } from '@/types/video.types';
import TrendingVideosSection from '@/components/TrendingVideosSection';
import PopularLiveSection from '@/components/PopularLiveSection';
import { Helmet } from 'react-helmet-async';
import EmptyFeedState from '@/components/video/EmptyFeedState';

const HomePage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('trending'); // Default to trending as it's more reliable
  const [activeIndex, setActiveIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("HomePage: Fetching videos for tab:", activeTab);
      let fetchedVideos: Video[] = [];
      
      if (activeTab === 'for-you') {
        try {
          fetchedVideos = await VideoService.getForYouVideos();
        } catch (err: any) {
          console.error("Error fetching For You videos:", err);
          setError("Could not load For You videos. Trying another feed...");
          // Automatically switch to trending if For You fails
          setActiveTab('trending');
        }
      } else if (activeTab === 'trending') {
        fetchedVideos = await VideoService.getTrendingVideos();
      } else {
        // For following tab or fallback, use regular videos
        fetchedVideos = await VideoService.getVideos(20);
      }
      
      console.log("HomePage: Fetched videos:", fetchedVideos?.length || 0);
      
      // If current feed is empty, try another one
      if (fetchedVideos.length === 0 && retryCount < 2) {
        setRetryCount(prev => prev + 1);
        
        if (activeTab === 'for-you') {
          console.log("No videos in For You tab, trying trending");
          const trendingVideos = await VideoService.getTrendingVideos();
          if (trendingVideos.length > 0) {
            fetchedVideos = trendingVideos;
            // Show toast to inform user
            toast("Showing you trending videos instead");
          } else {
            const regularVideos = await VideoService.getVideos(10);
            fetchedVideos = regularVideos;
          }
        } else if (activeTab === 'trending') {
          console.log("No videos in Trending tab, trying regular videos");
          fetchedVideos = await VideoService.getVideos(10);
        }
      }
      
      setVideos(fetchedVideos);
      
      // If we still have no videos after all attempts, show error
      if (fetchedVideos.length === 0) {
        setError("No videos available at the moment. Please try again later.");
      }
    } catch (err: any) {
      console.error("HomePage: Error fetching videos:", err);
      setError("Failed to load videos. Please check your connection and try again.");
      
      // Try to fetch regular videos as fallback
      try {
        const regularVideos = await VideoService.getVideos(10);
        if (regularVideos.length > 0) {
          console.log("HomePage: Using regular videos as fallback");
          setVideos(regularVideos);
          setError(null);
        }
      } catch (fallbackErr) {
        console.error("HomePage: Even fallback video fetch failed:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, retryCount]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);
  
  // Reset retry count when changing tabs
  useEffect(() => {
    setRetryCount(0);
  }, [activeTab]);

  const handleRefresh = () => {
    toast("Refreshing feed...");
    setRetryCount(0);
    fetchVideos();
  };

  const handleVideoView = async (videoId: string) => {
    try {
      await VideoService.incrementViewCount(videoId);
      console.log("View count incremented for video:", videoId);
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  return (
    <div className="flex-1 relative">
      <Helmet>
        <title>Home | Luv</title>
      </Helmet>
      
      <div className="sticky top-0 z-10 bg-app-black/80 backdrop-blur-sm border-b border-app-gray-dark">
        <div className="flex justify-center space-x-4 pb-2 pt-3">
          <button
            className={`px-4 py-1 text-sm font-medium rounded-full ${
              activeTab === 'for-you'
                ? 'bg-app-yellow text-app-black'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('for-you')}
          >
            For You
          </button>
          <button
            className={`px-4 py-1 text-sm font-medium rounded-full ${
              activeTab === 'trending'
                ? 'bg-app-yellow text-app-black'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('trending')}
          >
            Trending
          </button>
          <button
            className={`px-4 py-1 text-sm font-medium rounded-full ${
              activeTab === 'following'
                ? 'bg-app-yellow text-app-black'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
        </div>
      </div>

      <div className="pt-2 pb-16 h-[calc(100vh-150px)]">
        {loading ? (
          <EmptyFeedState isLoading={true} />
        ) : error && videos.length === 0 ? (
          <EmptyFeedState error={error} onRetry={handleRefresh} />
        ) : videos.length > 0 ? (
          <VideoFeed 
            videos={videos} 
            activeIndex={activeIndex}
            onVideoChange={setActiveIndex}
            onVideoView={handleVideoView}
            isActive={true} // Ensure videos always play
          />
        ) : (
          <div className="flex flex-col gap-6 p-4">
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">No videos in this feed yet</h3>
              <p className="text-gray-400 mb-4">Check out trending videos or popular live streams</p>
              <Button onClick={handleRefresh} variant="outline" className="flex items-center mx-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>
            
            <TrendingVideosSection videos={[]} />
            <PopularLiveSection creators={[]} />
            
            <div className="text-center mt-4">
              <ChevronDown className="h-6 w-6 mx-auto text-gray-400 animate-bounce" />
              <p className="text-gray-400 text-sm">Scroll for more content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
