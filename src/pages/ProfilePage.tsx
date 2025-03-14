
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Grid, Lock, Settings, Edit2, Activity, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("videos");
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [likedVideos, setLikedVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserContent = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch videos created by user
        const { data: videos, error: videosError } = await supabase
          .from('short_videos')
          .select('*')
          .eq('user_id', user.id);
          
        if (videosError) throw videosError;
        setUserVideos(videos || []);
        
        // Fetch videos liked by user
        const { data: likes, error: likesError } = await supabase
          .from('video_likes')
          .select('video_id')
          .eq('user_id', user.id);
          
        if (likesError) throw likesError;
        
        if (likes && likes.length > 0) {
          const videoIds = likes.map(like => like.video_id);
          const { data: likedVideosData, error: likedVideosError } = await supabase
            .from('short_videos')
            .select('*')
            .in('id', videoIds);
            
          if (likedVideosError) throw likedVideosError;
          setLikedVideos(likedVideosData || []);
        }
      } catch (error) {
        console.error("Error fetching user content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserContent();
  }, [user]);

  if (!user) {
    return null;
  }

  const renderVideoGrid = (videos: any[]) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
        </div>
      );
    }
    
    if (videos.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-400 h-48">
          <Grid className="w-12 h-12 mb-2" />
          <p>No videos found</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-3 gap-1">
        {videos.map((video, i) => (
          <div key={video.id} className="aspect-[9/16] bg-app-gray-light flex items-center justify-center relative overflow-hidden">
            <img 
              src={video.thumbnail_url || `https://picsum.photos/id/${10 + i}/300/500`} 
              alt={`Video thumbnail`}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-2 left-2 flex items-center text-white text-xs">
              <Grid className="w-3 h-3 mr-1" />
              <span>{video.view_count || 0}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-app-black">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-app-gray-dark to-app-gray-light"></div>
        <div className="absolute -bottom-16 w-full flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-app-black overflow-hidden">
            <img
              src={user.avatar_url || "https://via.placeholder.com/150"}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center px-4">
        <h1 className="text-2xl font-bold">@{user.username}</h1>
        
        <div className="flex justify-center gap-8 mt-4">
          <div className="profile-stat">
            <span className="text-xl font-bold">{user.followers || 0}</span>
            <span className="text-sm text-gray-400">Followers</span>
          </div>
          <div className="profile-stat">
            <span className="text-xl font-bold">{user.following || 0}</span>
            <span className="text-sm text-gray-400">Following</span>
          </div>
          <div className="profile-stat">
            <span className="text-xl font-bold">{user.coins || 0}</span>
            <span className="text-sm text-gray-400">Coins</span>
          </div>
        </div>

        <div className="flex gap-3 mt-4 w-full justify-center">
          <Button variant="outline" className="bg-transparent border-app-yellow text-app-yellow hover:bg-app-yellow hover:text-app-black">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
          <Button 
            variant="outline" 
            className="bg-transparent border-app-yellow text-app-yellow hover:bg-app-yellow hover:text-app-black" 
            onClick={() => logout()}
          >
            <Settings className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
        
        {/* Link to Activity Page */}
        <Link to="/activity" className="mt-4 w-full">
          <div className="bg-app-gray-dark p-3 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-app-yellow mr-2" />
              <span className="text-white">View Activity</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>

        <Tabs defaultValue="videos" className="w-full mt-8">
          <TabsList className="w-full bg-app-gray-dark">
            <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
            <TabsTrigger value="liked" className="flex-1">Liked</TabsTrigger>
            <TabsTrigger value="private" className="flex-1">Private</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-4">
            {renderVideoGrid(userVideos)}
          </TabsContent>
          
          <TabsContent value="liked" className="mt-4">
            {renderVideoGrid(likedVideos)}
          </TabsContent>
          
          <TabsContent value="private" className="mt-4">
            <div className="h-48 flex flex-col items-center justify-center text-gray-400">
              <Lock className="w-12 h-12 mb-2" />
              <p>Your private videos are only visible to you</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
