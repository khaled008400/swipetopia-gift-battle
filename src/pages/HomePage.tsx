
import { useEffect, useState } from "react";
import VideoFeed from "../components/VideoFeed";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "@/types/video.types";
import { useToast } from "@/hooks/use-toast";
import { useRealtimeData } from "@/hooks/useRealtimeData";

const HomePage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [localVideos, setLocalVideos] = useState<Video[]>([]);
  
  // Fetch initial videos from Supabase
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('videos')
          .select(`
            id, 
            title,
            description,
            video_url,
            thumbnail_url,
            likes_count,
            comments_count,
            shares_count,
            view_count,
            hashtags,
            is_live,
            created_at,
            user_id,
            profiles:user_id (username, avatar_url)
          `)
          .order('created_at', { ascending: false })
          .limit(50);
          
        if (error) {
          console.error("Error fetching videos:", error);
          toast({
            title: "Error loading videos",
            description: "Please try again later",
            variant: "destructive",
          });
          return;
        }
        
        if (data && data.length > 0) {
          const formattedVideos: Video[] = data.map(video => ({
            id: video.id,
            title: video.title || '',
            description: video.description || '',
            video_url: video.video_url || '',
            thumbnail_url: video.thumbnail_url || '',
            user_id: video.user_id || '',
            created_at: video.created_at || '',
            updated_at: video.created_at || '',
            view_count: video.view_count || 0,
            likes_count: video.likes_count || 0,
            comments_count: video.comments_count || 0,
            shares_count: video.shares_count || 0,
            is_live: video.is_live || false,
            is_private: false,
            duration: 0,
            category: '',
            url: video.video_url,
            likes: video.likes_count,
            comments: video.comments_count,
            shares: video.shares_count,
            isLive: video.is_live,
            user: {
              username: video.profiles?.username || 'unknown',
              avatar: video.profiles?.avatar_url || '/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png'
            }
          }));
          setLocalVideos(formattedVideos);
        } else {
          // Fallback to sample videos if no data is available
          setLocalVideos(formatSampleVideos(sampleVideos));
        }
      } catch (err) {
        console.error("Error in video fetch:", err);
        setLocalVideos(formatSampleVideos(sampleVideos));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVideos();
  }, [toast]);
  
  // Helper function to format sample videos to match Video type
  const formatSampleVideos = (videos: any[]): Video[] => {
    return videos.map(video => ({
      id: video.id,
      title: video.description || '',
      description: video.description || '',
      video_url: video.url || '',
      thumbnail_url: '',
      user_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
      likes_count: video.likes || 0,
      comments_count: video.comments || 0,
      shares_count: video.shares || 0,
      is_live: video.isLive || false,
      is_private: false,
      duration: 0,
      category: '',
      url: video.url,
      likes: video.likes,
      comments: video.comments,
      shares: video.shares,
      isLive: video.isLive,
      user: video.user
    }));
  };
  
  // Use the real-time hook to listen for changes
  const { data: realtimeVideos } = useRealtimeData<any>(
    'videos',
    [], // Initial data is empty, we'll handle it separately
    null,
    { refetchInterval: 30000 } // Add refetch interval to prevent infinite updates
  );
  
  // When realtime updates come in, process them
  useEffect(() => {
    if (realtimeVideos && realtimeVideos.length > 0) {
      const newVideos = realtimeVideos.map(video => ({
        id: video.id,
        title: video.title || '',
        description: video.description || '',
        video_url: video.video_url || '',
        thumbnail_url: video.thumbnail_url || '',
        user_id: video.user_id || '',
        created_at: video.created_at || '',
        updated_at: video.updated_at || '',
        view_count: video.view_count || 0,
        likes_count: video.likes_count || 0,
        comments_count: video.comments_count || 0,
        shares_count: video.shares_count || 0,
        is_live: video.is_live || false,
        is_private: false,
        duration: 0,
        category: '',
        url: video.video_url,
        likes: video.likes_count,
        comments: video.comments_count,
        shares: video.shares_count,
        isLive: video.is_live,
        user: {
          username: video.profiles?.username || 'unknown',
          avatar: video.profiles?.avatar_url || '/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png'
        }
      }));
      
      // Add new videos to the top of the feed
      setLocalVideos(prev => [...newVideos, ...prev]);
      // Reset to the first video
      setActiveVideoIndex(0);
      
      toast({
        title: "New videos available",
        description: "Fresh content has been added to your feed",
      });
    }
  }, [realtimeVideos, toast]);
  
  // Sample videos as fallback
  const sampleVideos = [
    {
      id: "1",
      url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-on-a-video-call-43892-large.mp4",
      user: {
        username: "fashionista",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      },
      description: "Check out my new collection! #fashion #style #trending",
      likes: 1243,
      comments: 89,
      shares: 56
    },
    {
      id: "2",
      url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
      user: {
        username: "makeup_artist",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      },
      description: "New makeup tutorial for the weekend party! #makeup #glam",
      likes: 2467,
      comments: 134,
      shares: 89,
      isLive: true
    },
    {
      id: "3",
      url: "https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-happily-in-a-field-at-sunset-1230-large.mp4",
      user: {
        username: "travel_vibes",
        avatar: "/lovable-uploads/30e70013-6e07-4756-89e8-c3f883e4d4c2.png"
      },
      description: "Sunset vibes in Bali 🌴 #travel #sunset #bali",
      likes: 5698,
      comments: 241,
      shares: 178
    }
  ];

  // Detect swipe to change videos
  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && activeVideoIndex < localVideos.length - 1) {
        setActiveVideoIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && activeVideoIndex > 0) {
        setActiveVideoIndex(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [activeVideoIndex, localVideos.length]);

  // Function to track video views
  const handleVideoView = async (videoId: string) => {
    if (!videoId || videoId.length < 5) return; // Skip for demo videos
    
    try {
      // Update view count in database
      const { error } = await supabase.rpc('increment_video_counter', {
        video_id: videoId,
        counter_name: 'view_count'
      });
      
      if (error) console.error("Error incrementing view count:", error);
      
      // Record the view interaction
      if (user) {
        const { error: interactionError } = await supabase
          .from('video_interactions')
          .upsert({
            video_id: videoId,
            user_id: user.id,
            interaction_type: 'view'
          }, {
            onConflict: 'video_id,user_id,interaction_type'
          });
          
        if (interactionError) console.error("Error recording view:", interactionError);
      }
    } catch (err) {
      console.error("Error tracking view:", err);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-full w-full bg-app-black">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-yellow"></div>
        </div>
      ) : (
        <VideoFeed 
          videos={localVideos} 
          activeVideoIndex={activeVideoIndex} 
          onVideoView={handleVideoView}
        />
      )}
    </div>
  );
};

export default HomePage;
