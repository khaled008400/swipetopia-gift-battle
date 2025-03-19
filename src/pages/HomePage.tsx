
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import VideoFeed from '@/components/VideoFeed';
import VideoService from '@/services/video.service';
import { ChevronDown, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { VideoTypes } from '@/types/video.types';
import TrendingVideosSection from '@/components/TrendingVideosSection';
import PopularLiveSection from '@/components/PopularLiveSection';

const HomePage = () => {
  const [videos, setVideos] = useState<VideoTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('for-you');

  useEffect(() => {
    fetchVideos();
  }, [activeTab]);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching videos for tab:", activeTab);
      let fetchedVideos: VideoTypes[] = [];
      
      if (activeTab === 'for-you') {
        try {
          fetchedVideos = await VideoService.getForYouVideos();
        } catch (err: any) {
          console.error("Error fetching For You videos:", err);
          // If ForYou fails, use trending instead
          setActiveTab('trending');
          fetchedVideos = await VideoService.getTrendingVideos();
        }
      } else if (activeTab === 'trending') {
        fetchedVideos = await VideoService.getTrendingVideos();
      } else {
        // Default fallback
        fetchedVideos = [];
      }
      
      console.log("Fetched videos:", fetchedVideos);
      setVideos(fetchedVideos);
    } catch (err: any) {
      console.error("Error fetching videos:", err);
      setError(err.message || "Failed to load videos");
      
      // Fallback to mock data if available
      if (window.demo?.videosMock) {
        console.log("Using mock data as fallback");
        setVideos(window.demo.videosMock);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    toast("Refreshing feed...");
    fetchVideos();
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
          <VideoFeed videos={videos} />
        ) : (
          <div className="flex flex-col gap-6 p-4">
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">No videos in this feed yet</h3>
              <p className="text-gray-400 mb-4">Check out trending videos or popular live streams</p>
              <Button onClick={handleRefresh} variant="outline" className="flex items-center mx-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>
            
            <TrendingVideosSection />
            <PopularLiveSection />
            
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
