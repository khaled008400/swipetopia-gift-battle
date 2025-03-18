// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { convertBattleVideosToVideos } from '@/utils/video-converters';
import VideoPlayer from '@/components/VideoPlayer';
import VideoOverlay from '@/components/video/VideoOverlay';
import { Video } from '@/types/video.types';
import { useAuth } from '@/context/AuthContext';
import VideoService from '@/services/video.service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from "lucide-react";

const BattlePage = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [videos, setVideos] = useState<Video[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBattleData = async () => {
      setIsLoading(true);
      try {
        // Placeholder: Replace with actual battle data fetching logic
        const battleVideos = [
          {
            id: '1',
            title: 'Battle Video 1',
            description: 'Description for Battle Video 1',
            video_url: 'https://example.com/battle-video-1.mp4',
            thumbnail_url: 'https://example.com/battle-video-1.jpg',
            user_id: 'user1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            view_count: 100,
            likes_count: 10,
            comments_count: 5,
            shares_count: 2,
            is_live: false,
            is_private: false,
            duration: 60,
            category: 'battle',
            likes: 10,
            comments: 5,
            shares: 2,
            is_liked: false,
            is_saved: false,
            user: {
              username: 'User1',
              avatar: 'https://example.com/avatar1.jpg',
            },
            hashtags: ['battle', 'video1'],
          },
          {
            id: '2',
            title: 'Battle Video 2',
            description: 'Description for Battle Video 2',
            video_url: 'https://example.com/battle-video-2.mp4',
            thumbnail_url: 'https://example.com/battle-video-2.jpg',
            user_id: 'user2',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            view_count: 120,
            likes_count: 12,
            comments_count: 7,
            shares_count: 3,
            is_live: false,
            is_private: false,
            duration: 70,
            category: 'battle',
            likes: 12,
            comments: 7,
            shares: 3,
            is_liked: false,
            is_saved: false,
            user: {
              username: 'User2',
              avatar: 'https://example.com/avatar2.jpg',
            },
            hashtags: ['battle', 'video2'],
          },
        ];
      
      // Convert battle videos to regular videos
      const convertedVideos = convertBattleVideosToVideos(battleVideos);
      setVideos(convertedVideos);
      
        setActiveIndex(0);
      } catch (error: any) {
        console.error("Error fetching battle data:", error);
        setError(error.message || "Failed to load battle data");
        toast({
          title: "Error",
          description: error.message || "Failed to load battle data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBattleData();
  }, [battleId]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-center text-gray-500">Loading battle videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <p className="text-center text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {videos.length > 0 ? (
        <>
          <VideoPlayer
            src={videos[activeIndex].video_url}
            poster={videos[activeIndex].thumbnail_url}
            isActive={true}
            videoId={videos[activeIndex].id}
          />
          <VideoOverlay
            video={{
              id: videos[activeIndex].id,
              description: videos[activeIndex].description || "",
              likes: videos[activeIndex].likes_count || 0,
              comments: videos[activeIndex].comments_count || 0,
              shares: videos[activeIndex].shares_count || 0,
              isLive: videos[activeIndex].is_live,
              isLiked: videos[activeIndex].is_liked,
              isSaved: videos[activeIndex].is_saved,
              allowDownloads: true,
              user: {
                username: videos[activeIndex].user?.username || "Unknown",
                avatar: videos[activeIndex].user?.avatar || "",
                isFollowing: false,
              },
            }}
            isLiked={videos[activeIndex].is_liked || false}
            isSaved={videos[activeIndex].is_saved || false}
            onLike={() => {}}
            onSave={() => {}}
            onFollow={() => {}}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <p className="text-center text-gray-500">No videos found for this battle.</p>
        </div>
      )}
    </div>
  );
};

export default BattlePage;
