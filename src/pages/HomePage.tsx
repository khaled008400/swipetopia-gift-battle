
import React, { useState, useEffect, useCallback } from 'react';
import VideoFeed from '@/components/VideoFeed';
import VideoService from '@/services/video';
import { RefreshCcw, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Video } from '@/types/video.types';
import ActiveStreamers from '@/components/live/ActiveStreamers';
import { Helmet } from 'react-helmet-async';
import EmptyFeedState from '@/components/video/EmptyFeedState';
import VideoUploadModal from '@/components/upload/VideoUploadModal';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAuthCheck } from '@/hooks/useAuthCheck';

const HomePage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('for-you'); // Default to for-you
  const [activeIndex, setActiveIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [selectedStreamerId, setSelectedStreamerId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { requiresAuth, AuthDialog } = useAuthCheck();

  // Check for upload param in URL
  useEffect(() => {
    const shouldOpenUpload = searchParams.get('upload') === 'true';
    if (shouldOpenUpload) {
      handleOpenUploadModal();
    }
  }, [searchParams]);

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
          // If For You fails, try regular videos
          fetchedVideos = await VideoService.getVideos(20);
          toast.info("Showing you regular videos instead");
        }
      } else if (activeTab === 'live') {
        // For the live tab, just show regular videos for now
        // In a real app, this would filter for live videos
        fetchedVideos = await VideoService.getVideos(20);
      } else {
        // For following tab or fallback, use regular videos
        fetchedVideos = await VideoService.getVideos(20);
      }
      
      console.log("HomePage: Fetched videos:", fetchedVideos?.length || 0);
      
      // If current feed is empty, try another one
      if (fetchedVideos.length === 0 && retryCount < 2) {
        setRetryCount(prev => prev + 1);
        
        if (activeTab === 'for-you') {
          console.log("No videos in For You tab, trying regular videos");
          toast.info("Showing you regular videos instead");
          const regularVideos = await VideoService.getVideos(10);
          fetchedVideos = regularVideos;
        }
      }
      
      setVideos(fetchedVideos);
      setHasFetchedOnce(true);
      
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
    toast.info("Refreshing feed...");
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

  const handleStreamerSelect = (streamerId: string) => {
    setSelectedStreamerId(streamerId);
    toast.info(`Viewing streamer's content`);
  };

  const handleOpenUploadModal = () => {
    requiresAuth(() => {
      setIsUploadModalOpen(true);
    });
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleVideoUploadSuccess = (videoId: string) => {
    console.log('Video uploaded successfully, ID:', videoId);
    fetchVideos();
    
    toast({
      title: 'Success!',
      description: 'Your video has been uploaded and will appear shortly',
    });
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
              activeTab === 'live'
                ? 'bg-app-yellow text-app-black'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setActiveTab('live')}
          >
            Live
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

      <div className="pt-2 pb-16 h-[calc(100vh-150px)] relative">
        {/* Add ActiveStreamers component at the top */}
        {activeTab === 'live' && (
          <ActiveStreamers 
            onStreamerSelect={handleStreamerSelect}
            selectedStreamerId={selectedStreamerId}
          />
        )}
        
        {loading && !hasFetchedOnce ? (
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
              <p className="text-gray-400 mb-4">Try refreshing or check back later</p>
              <Button onClick={handleRefresh} variant="outline" className="flex items-center mx-auto">
                <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </div>
          </div>
        )}
        
        {/* Floating upload button (TikTok style) */}
        <Button
          onClick={handleOpenUploadModal}
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full bg-app-yellow text-black shadow-lg flex items-center justify-center"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Video upload modal */}
      <VideoUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={handleCloseUploadModal} 
        onSuccess={handleVideoUploadSuccess}
      />
      
      <AuthDialog />
    </div>
  );
};

export default HomePage;
