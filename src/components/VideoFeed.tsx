
import { useState, useEffect, useCallback } from "react";
import { Video } from "../types/video.types";
import VideoPlayer from "./VideoPlayer";
import VideoOverlay from "./video/VideoOverlay";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface VideoFeedProps {
  videos: Video[];
  activeVideoIndex: number;
  onVideoView?: (videoId: string) => void;
}

const VideoFeed = ({ videos, activeVideoIndex, onVideoView }: VideoFeedProps) => {
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userSaves, setUserSaves] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  // Fetch user interactions on load
  useEffect(() => {
    if (user) {
      const fetchUserInteractions = async () => {
        try {
          // Get likes
          const { data: likesData, error: likesError } = await supabase
            .from('video_interactions')
            .select('video_id')
            .eq('user_id', user.id)
            .eq('interaction_type', 'like');

          if (likesError) throw likesError;

          const newLikes: Record<string, boolean> = {};
          likesData?.forEach(item => { newLikes[item.video_id] = true; });
          setUserLikes(newLikes);

          // Get saves
          const { data: savesData, error: savesError } = await supabase
            .from('video_interactions')
            .select('video_id')
            .eq('user_id', user.id)
            .eq('interaction_type', 'save');

          if (savesError) throw savesError;

          const newSaves: Record<string, boolean> = {};
          savesData?.forEach(item => { newSaves[item.video_id] = true; });
          setUserSaves(newSaves);
        } catch (err) {
          console.error("Error fetching user interactions:", err);
        }
      };

      fetchUserInteractions();
    }
  }, [user]);

  // Track video views
  useEffect(() => {
    if (videos[activeVideoIndex]?.id && onVideoView) {
      onVideoView(videos[activeVideoIndex].id);
    }
  }, [activeVideoIndex, videos, onVideoView]);

  const handleLike = async (videoId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to like videos",
      });
      return;
    }

    try {
      const isCurrentlyLiked = userLikes[videoId];
      
      // Optimistically update UI
      setUserLikes(prev => ({
        ...prev,
        [videoId]: !isCurrentlyLiked
      }));

      if (isCurrentlyLiked) {
        // Unlike
        await supabase
          .from('video_interactions')
          .delete()
          .match({
            video_id: videoId,
            user_id: user.id,
            interaction_type: 'like'
          });

        // Decrement likes count
        await supabase
          .from('videos')
          .update({ likes_count: videos[activeVideoIndex].likes - 1 })
          .eq('id', videoId);
      } else {
        // Like
        await supabase
          .from('video_interactions')
          .upsert({
            video_id: videoId,
            user_id: user.id,
            interaction_type: 'like'
          });

        // Increment likes count
        await supabase.rpc('increment_video_counter', {
          video_id: videoId,
          counter_name: 'likes_count'
        });
      }
    } catch (err) {
      console.error("Error liking video:", err);
      // Revert optimistic update on error
      setUserLikes(prev => ({
        ...prev,
        [videoId]: !prev[videoId]
      }));
      toast({
        title: "Error",
        description: "Failed to like video",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (videoId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save videos",
      });
      return;
    }

    try {
      const isCurrentlySaved = userSaves[videoId];
      
      // Optimistically update UI
      setUserSaves(prev => ({
        ...prev,
        [videoId]: !isCurrentlySaved
      }));

      if (isCurrentlySaved) {
        // Unsave
        await supabase
          .from('video_interactions')
          .delete()
          .match({
            video_id: videoId,
            user_id: user.id,
            interaction_type: 'save'
          });
      } else {
        // Save
        await supabase
          .from('video_interactions')
          .upsert({
            video_id: videoId,
            user_id: user.id,
            interaction_type: 'save'
          });
      }
    } catch (err) {
      console.error("Error saving video:", err);
      // Revert optimistic update on error
      setUserSaves(prev => ({
        ...prev,
        [videoId]: !prev[videoId]
      }));
      toast({
        title: "Error",
        description: "Failed to save video",
        variant: "destructive",
      });
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to follow users",
      });
      return;
    }
    
    const videoCreatorId = videos[activeVideoIndex]?.user_id;
    
    if (!videoCreatorId) {
      toast({
        title: "Error",
        description: "Cannot follow this user",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Check if already following
      const { data, error } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', videoCreatorId)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        // Unfollow
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', videoCreatorId);
          
        // Update follower count
        await supabase.rpc('decrement_followers', {
          user_id: videoCreatorId
        });
        
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${videos[activeVideoIndex].user.username}`,
        });
      } else {
        // Follow
        await supabase
          .from('followers')
          .insert({
            follower_id: user.id,
            following_id: videoCreatorId
          });
          
        // Update follower count
        await supabase.rpc('increment_followers', {
          user_id: videoCreatorId
        });
        
        toast({
          title: "Following",
          description: `You are now following ${videos[activeVideoIndex].user.username}`,
        });
      }
    } catch (err) {
      console.error("Error following user:", err);
      toast({
        title: "Error",
        description: "Failed to follow user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full w-full relative">
      {videos.map((video, index) => (
        <div
          key={video.id || index}
          className={`absolute top-0 left-0 h-full w-full transition-transform duration-300 ${
            index === activeVideoIndex
              ? "translate-y-0 opacity-100 z-10"
              : index < activeVideoIndex
              ? "-translate-y-full opacity-0 z-0"
              : "translate-y-full opacity-0 z-0"
          }`}
        >
          <VideoPlayer
            videoUrl={video.url}
            isActive={index === activeVideoIndex}
          />
          <VideoOverlay
            video={video}
            isLiked={userLikes[video.id] || false}
            isSaved={userSaves[video.id] || false}
            onLike={() => video.id && handleLike(video.id)}
            onSave={() => video.id && handleSave(video.id)}
            onFollow={handleFollow}
          />
        </div>
      ))}
      
      {/* Navigation indicator */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col items-center z-20">
        {videos.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-10 my-1 rounded-full ${
              index === activeVideoIndex ? "bg-app-yellow" : "bg-gray-500 bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;
