
import { useState, useEffect } from "react";
import { Play, Heart, Gift, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StreamHighlights from "./StreamHighlights";
import SupportSection from "./SupportSection";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useScheduledStreams } from "@/hooks/useStreamerData";

interface StreamerProfile {
  id: string;
  username: string;
  avatar_url: string;
  bio: string;
  followers: number;
  following: number;
  isLive?: boolean;
  interests?: string[];
}

interface PublicProfileProps {
  streamerId?: string;
}

const PublicProfile = ({ streamerId }: PublicProfileProps) => {
  const { user } = useAuth();
  const [streamer, setStreamer] = useState<StreamerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const { scheduledStreams } = useScheduledStreams(streamerId || '');
  const nextStream = scheduledStreams[0];
  
  const isOwnProfile = user?.id === streamerId;
  
  useEffect(() => {
    const fetchStreamerProfile = async () => {
      if (!streamerId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch streamer profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', streamerId)
          .single();
          
        if (profileError) throw profileError;
        
        // Check if streamer is currently live
        const { data: streamData } = await supabase
          .from('streams')
          .select('*')
          .eq('user_id', streamerId)
          .eq('status', 'live')
          .maybeSingle();
        
        // Check if the current user is following this streamer
        if (user && user.id !== streamerId) {
          // This would require a follows table, which we don't have in this example
          // For now, we'll use a random value
          setIsFollowing(Math.random() > 0.5);
        }
        
        setStreamer({
          ...profileData,
          isLive: streamData ? true : false,
        });
      } catch (err) {
        console.error("Error fetching streamer profile:", err);
        setError("Failed to load streamer profile");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStreamerProfile();
  }, [streamerId, user]);
  
  const handleFollow = () => {
    // In a real app, this would call an API to follow/unfollow
    setIsFollowing(!isFollowing);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-24 mt-2 md:mt-0" />
            </div>
            <Skeleton className="h-4 w-full max-w-2xl mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl mb-4" />
            <div className="flex gap-6">
              <div>
                <Skeleton className="h-6 w-16 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-6 w-16 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !streamer) {
    return <div className="text-red-500">Failed to load streamer profile</div>;
  }
  
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-app-yellow">
            <AvatarImage src={streamer.avatar_url} />
            <AvatarFallback>{streamer.username?.slice(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
          </Avatar>
          {streamer.isLive && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              LIVE
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold">{streamer.username}</h1>
              <p className="text-muted-foreground">@{streamer.username}</p>
            </div>
            
            {!isOwnProfile && (
              <Button 
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                className={`mt-2 md:mt-0 ${
                  isFollowing ? "border-app-yellow text-app-yellow" : "bg-app-yellow text-app-black"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
          
          <p className="mb-4">{streamer.bio || "No bio available"}</p>
          
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-lg font-bold">{streamer.followers?.toLocaleString() || 0}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div>
              <div className="text-lg font-bold">{streamer.following?.toLocaleString() || 0}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {streamer.interests?.map((tag: string) => (
              <span key={tag} className="bg-app-gray-light px-2 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Next Stream Card */}
      {nextStream && (
        <Card className="bg-app-gray-dark border-app-gray-light">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-app-yellow mr-3" />
                <div>
                  <h3 className="font-medium">Next Stream</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(nextStream.scheduled_time).toLocaleDateString("en-US", { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="gap-1">
                <Play className="h-4 w-4" />
                Set Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Stream Highlights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Stream Highlights</h2>
          <Button variant="link" className="gap-1 text-app-yellow">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <StreamHighlights streamerId={streamerId} />
      </div>
      
      {/* Support Me Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            Support {isOwnProfile ? "Me" : streamer.username}
          </h2>
        </div>
        <SupportSection streamerId={streamerId} />
      </div>
    </div>
  );
};

export default PublicProfile;
