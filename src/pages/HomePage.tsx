// Import necessary components
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import VideoService from '@/services/video.service';
import VideoFeed from '@/components/VideoFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video } from '@/types/video.types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentTab, setCurrentTab] = useState('for-you');
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [noFollowingContent, setNoFollowingContent] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        
        let videosData;
        if (currentTab === 'following' && user) {
          videosData = await VideoService.getFollowingVideos(user.id);
          if (videosData.length === 0) {
            // If user isn't following anyone or they have no videos, show a message
            // and maybe fallback to For You videos
            setNoFollowingContent(true);
            videosData = await VideoService.getForYouVideos();
          } else {
            setNoFollowingContent(false);
          }
        } else {
          videosData = await VideoService.getForYouVideos();
          setNoFollowingContent(false);
        }
        
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [currentTab, user]);
  
  const handleVideoChange = (index: number) => {
    setActiveVideoIndex(index);
  };
  
  const handleVideoView = async (videoId: string) => {
    await VideoService.incrementViewCount(videoId);
  };
  
  return (
    <div className="h-full w-full">
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full h-full">
        <TabsList className="w-full flex justify-center">
          <TabsTrigger value="for-you">For You</TabsTrigger>
          <TabsTrigger value="following" disabled={!user}>Following</TabsTrigger>
        </TabsList>
        <TabsContent value="for-you" className="h-[calc(100%-40px)] relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full w-full">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-center text-gray-500">Loading videos...</p>
            </div>
          ) : (
            <VideoFeed
              videos={videos}
              activeIndex={activeVideoIndex}
              onVideoChange={handleVideoChange}
              onVideoView={handleVideoView}
            />
          )}
        </TabsContent>
        {user ? (
          <TabsContent value="following" className="h-[calc(100%-40px)] relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full w-full">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-center text-gray-500">Loading videos...</p>
              </div>
            ) : noFollowingContent ? (
              <Alert>
                <AlertTitle>No content from followed users</AlertTitle>
                <AlertDescription>
                  Follow some creators to see their videos here.
                </AlertDescription>
              </Alert>
            ) : (
              <VideoFeed
                videos={videos}
                activeIndex={activeVideoIndex}
                onVideoChange={handleVideoChange}
                onVideoView={handleVideoView}
              />
            )}
          </TabsContent>
        ) : (
          <TabsContent value="following" className="h-[calc(100%-40px)] relative">
            <Alert>
              <AlertTitle>Authentication required</AlertTitle>
              <AlertDescription>
                You need to be logged in to view content from followed users.
              </AlertDescription>
            </Alert>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default HomePage;
