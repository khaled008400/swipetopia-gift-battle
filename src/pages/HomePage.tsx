
import React, { useState, useEffect } from 'react';
import VideoFeed from '@/components/VideoFeed';
import VideoService from '@/services/video';
import { ChevronDown, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Video } from '@/types/video.types';
import TrendingVideosSection from '@/components/TrendingVideosSection';
import PopularLiveSection from '@/components/PopularLiveSection';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('trending'); // Default to trending as it's more reliable
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, [activeTab]);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("HomePage: Fetching videos for tab:", activeTab);
      let fetchedVideos: Video[] = [];
      
      if (activeTab === 'for-you') {
        try {
          fetchedVideos = await VideoService.getForYouVideos();
          if (fetchedVideos.length === 0) {
            // If no videos returned in For You tab, switch to trending
            console.log("No videos in For You tab, switching to trending");
            setActiveTab('trending');
            fetchedVideos = await VideoService.getTrendingVideos();
          }
        } catch (err: any) {
          console.error("Error fetching For You videos:", err);
          // If ForYou fails, use trending instead
          setActiveTab('trending');
          fetchedVideos = await VideoService.getTrendingVideos();
        }
      } else if (activeTab === 'trending') {
        fetchedVideos = await VideoService.getTrendingVideos();
      } else if (activeTab === 'following') {
        // For following tab, use regular videos as public users can't see followed content
        fetchedVideos = await VideoService.getVideos(20);
      } else {
        // Default fallback - get regular videos
        fetchedVideos = await VideoService.getVideos(20);
      }
      
      console.log("HomePage: Fetched videos:", fetchedVideos.length);
      
      if (fetchedVideos.length === 0) {
        // If still no videos, try one more fallback to regular videos
        fetchedVideos = await VideoService.getVideos(20);
      }
      
      setVideos(fetchedVideos);
    } catch (err: any) {
      console.error("HomePage: Error fetching videos:", err);
      setError(err.message || "Failed to load videos");
      
      // Try to fetch regular videos as fallback
      try {
        const regularVideos = await VideoService.getVideos(20);
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
  };

  const handleRefresh = () => {
    toast("Refreshing feed...");
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

      <div className="pt-2 pb-16">
        {loading ? (
          <div className="flex justify-center items-center h-[70vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-yellow"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-[70vh] px-4 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline" className="flex items-center">
              <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
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
