
import { useState, useEffect } from "react";
import { Play, Heart, Gift, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StreamHighlights from "./StreamHighlights";
import SupportSection from "./SupportSection";
import { useAuth } from "@/context/AuthContext";

const mockStreamerData = {
  id: "streamer-123",
  username: "topstreamer",
  displayName: "Top Streamer",
  avatar: "https://i.pravatar.cc/150?u=topstreamer",
  bio: "Fashion enthusiast and lifestyle streamer. Join me for the latest trends, hauls, and styling tips!",
  followers: 12450,
  following: 342,
  isLive: true,
  isFollowing: false,
  tags: ["fashion", "lifestyle", "beauty", "shopping"],
  nextStream: new Date(Date.now() + 86400000 * 2) // 2 days from now
};

interface PublicProfileProps {
  streamerId?: string;
}

const PublicProfile = ({ streamerId }: PublicProfileProps) => {
  const { user } = useAuth();
  const [streamer, setStreamer] = useState(mockStreamerData);
  const [isFollowing, setIsFollowing] = useState(mockStreamerData.isFollowing);
  
  const handleFollow = () => {
    // In a real app, this would call an API to follow/unfollow
    setIsFollowing(!isFollowing);
  };
  
  useEffect(() => {
    // In a real app, this would fetch the streamer data based on streamerId
    console.log("Fetching data for streamer:", streamerId);
    // For now, we'll just use the mock data
  }, [streamerId]);
  
  const isOwnProfile = user?.id === streamerId;
  
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-app-yellow">
            <AvatarImage src={streamer.avatar} />
            <AvatarFallback>{streamer.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
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
              <h1 className="text-2xl font-bold">{streamer.displayName}</h1>
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
          
          <p className="mb-4">{streamer.bio}</p>
          
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-lg font-bold">{streamer.followers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div>
              <div className="text-lg font-bold">{streamer.following.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {streamer.tags.map(tag => (
              <span key={tag} className="bg-app-gray-light px-2 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Next Stream Card */}
      {streamer.nextStream && (
        <Card className="bg-app-gray-dark border-app-gray-light">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-app-yellow mr-3" />
                <div>
                  <h3 className="font-medium">Next Stream</h3>
                  <p className="text-sm text-muted-foreground">
                    {streamer.nextStream.toLocaleDateString("en-US", { 
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
        <StreamHighlights />
      </div>
      
      {/* Support Me Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Heart className="h-5 w-5 text-red-500 mr-2" />
            Support {isOwnProfile ? "Me" : streamer.displayName}
          </h2>
        </div>
        <SupportSection streamerId={streamerId} />
      </div>
    </div>
  );
};

export default PublicProfile;
