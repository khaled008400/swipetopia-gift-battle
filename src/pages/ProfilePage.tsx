
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Grid, Lock, Settings, Edit2, Activity, ChevronRight, 
  ShoppingBag, Video, Users, Calendar, Award, StoreIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import RolesDisplay from "@/components/profile/RolesDisplay";
import ProfileEdit from "@/components/profile/ProfileEdit";
import { useUserProfile } from "@/hooks/useUserProfile";
import WalletSection from "@/components/profile/WalletSection";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { user: authUser, logout, hasRole } = useAuth();
  const { profile, isLoading: profileLoading, refreshProfile } = useUserProfile(authUser?.session?.user || null);
  
  const [activeTab, setActiveTab] = useState("videos");
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [likedVideos, setLikedVideos] = useState<any[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserContent = async () => {
      if (!profile) return;
      
      setIsLoadingVideos(true);
      try {
        const { data: videos, error: videosError } = await supabase
          .from('short_videos')
          .select('*')
          .eq('user_id', profile.id);
          
        if (videosError) throw videosError;
        setUserVideos(videos || []);
        
        const { data: likes, error: likesError } = await supabase
          .from('video_likes')
          .select('video_id')
          .eq('user_id', profile.id);
          
        if (likesError) throw likesError;
        
        if (likes && likes.length > 0) {
          const videoIds = likes.map(like => like.video_id);
          const { data: likedVideosData, error: likedVideosError } = await supabase
            .from('short_videos')
            .select('*')
            .in('id', videoIds);
            
          if (likedVideosError) throw likedVideosError;
          setLikedVideos(likedVideosData || []);
        } else {
          setLikedVideos([]);
        }
      } catch (error) {
        console.error("Error fetching user content:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your content"
        });
      } finally {
        setIsLoadingVideos(false);
      }
    };
    
    fetchUserContent();
  }, [profile]);

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-app-black">
        <Loader2 className="h-12 w-12 animate-spin text-app-yellow mb-4" />
        <p className="text-gray-400">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-app-black">
        <div className="bg-app-gray-dark p-8 rounded-lg text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Profile Not Available</h2>
          <p className="text-gray-400 mb-6">
            You need to be logged in to view your profile. Please log in or create an account.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/login')} className="bg-app-yellow text-app-black">
              Login
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/signup')}
              className="border-app-yellow text-app-yellow"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderVideoGrid = (videos: any[], loading: boolean) => {
    if (loading) {
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
          <div 
            key={video.id} 
            className="aspect-[9/16] bg-app-gray-light flex items-center justify-center relative overflow-hidden"
            onClick={() => navigate(`/video/${video.id}`)}
          >
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

  const getRoleTabs = () => {
    const roleTabs = [];
    
    if (hasRole("seller")) {
      roleTabs.push(
        <TabsTrigger key="products" value="products" className="flex-1">
          <ShoppingBag className="w-4 h-4 mr-1" /> Products
        </TabsTrigger>
      );
    }
    
    if (hasRole("streamer")) {
      roleTabs.push(
        <TabsTrigger key="streams" value="streams" className="flex-1">
          <Video className="w-4 h-4 mr-1" /> Streams
        </TabsTrigger>
      );
    }
    
    return roleTabs;
  };

  const getRoleContent = () => {
    const roleContent = [];
    
    if (hasRole("seller")) {
      roleContent.push(
        <TabsContent key="products" value="products" className="mt-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Your Products</h3>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-app-yellow text-app-yellow"
                onClick={() => navigate('/seller/products/new')}
              >
                + Add Product
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-app-gray-dark rounded-lg p-2">
                  <div className="aspect-square bg-app-gray-light rounded-md mb-2">
                    <img 
                      src={`https://picsum.photos/id/${20 + item}/200/200`} 
                      alt="Product" 
                      className="w-full h-full object-cover rounded-md" 
                    />
                  </div>
                  <p className="text-white text-sm font-medium truncate">Product Name {item}</p>
                  <p className="text-app-yellow text-xs">$19.99</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      );
    }
    
    if (hasRole("streamer")) {
      roleContent.push(
        <TabsContent key="streams" value="streams" className="mt-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Your Streams</h3>
              <Button 
                size="sm" 
                className="bg-app-yellow text-app-black"
                onClick={() => navigate('/streamer/broadcast')}
              >
                Go Live
              </Button>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-app-gray-dark rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-md overflow-hidden">
                      <img 
                        src={`https://picsum.photos/id/${30 + item}/100/100`} 
                        alt="Stream thumbnail" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Stream #{item}</p>
                      <p className="text-gray-400 text-xs">2 hours ago • 1.2k views</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      );
    }
    
    return roleContent;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again."
      });
    }
  };

  if (editMode) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-64px)] bg-app-black p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <Button 
            variant="outline" 
            onClick={() => setEditMode(false)}
            className="border-app-yellow text-app-yellow"
          >
            Cancel
          </Button>
        </div>
        <ProfileEdit 
          onComplete={() => {
            setEditMode(false);
            refreshProfile();
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-app-black">
      <ProfileHeader user={profile} />
      <RolesDisplay roles={profile?.roles || []} />
      <ProfileStats user={profile} />

      <div className="mt-4 flex gap-3 w-full justify-center px-4">
        <Button 
          variant="outline" 
          className="bg-transparent border-app-yellow text-app-yellow hover:bg-app-yellow hover:text-app-black"
          onClick={() => setEditMode(true)}
        >
          <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
        </Button>
        <Button 
          variant="outline" 
          className="bg-transparent border-app-yellow text-app-yellow hover:bg-app-yellow hover:text-app-black" 
          onClick={handleLogout}
        >
          <Settings className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
      
      {/* Wallet Section */}
      <WalletSection user={profile} />
      
      <div className="mt-4 px-4 space-y-3">
        <Link to="/activity">
          <div className="bg-app-gray-dark p-3 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-app-yellow mr-2" />
              <span className="text-white">Activity Feed</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
        
        {hasRole("seller") && (
          <Link to="/seller/dashboard">
            <div className="bg-app-gray-dark p-3 rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <StoreIcon className="h-5 w-5 text-app-yellow mr-2" />
                <span className="text-white">Seller Dashboard</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        )}
        
        {hasRole("streamer") && (
          <Link to="/streamer/dashboard">
            <div className="bg-app-gray-dark p-3 rounded-lg flex justify-between items-center">
              <div className="flex items-center">
                <Video className="h-5 w-5 text-app-yellow mr-2" />
                <span className="text-white">Creator Studio</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        )}
        
        <Link to="/settings">
          <div className="bg-app-gray-dark p-3 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <Settings className="h-5 w-5 text-app-yellow mr-2" />
              <span className="text-white">App Settings</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Link>
      </div>

      <Tabs defaultValue="videos" className="w-full mt-8">
        <TabsList className="w-full bg-app-gray-dark">
          <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
          <TabsTrigger value="liked" className="flex-1">Liked</TabsTrigger>
          {getRoleTabs()}
          <TabsTrigger value="private" className="flex-1">Private</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="mt-4 px-4">
          {renderVideoGrid(userVideos, isLoadingVideos)}
        </TabsContent>
        
        <TabsContent value="liked" className="mt-4 px-4">
          {renderVideoGrid(likedVideos, isLoadingVideos)}
        </TabsContent>
        
        {getRoleContent()}
        
        <TabsContent value="private" className="mt-4 px-4">
          <div className="h-48 flex flex-col items-center justify-center text-gray-400">
            <Lock className="w-12 h-12 mb-2" />
            <p>Your private videos are only visible to you</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
