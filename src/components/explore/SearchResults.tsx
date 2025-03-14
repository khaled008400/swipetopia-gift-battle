
import { useState, useEffect } from "react";
import { User, Hash, Video, Mic, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface SearchResultsProps {
  searchQuery: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SearchResults = ({ searchQuery, activeTab, setActiveTab }: SearchResultsProps) => {
  // Mock data for search results
  const [results, setResults] = useState({
    users: [] as any[],
    hashtags: [] as any[],
    videos: [] as any[],
    sounds: [] as any[],
    lives: [] as any[],
  });

  // Simulate search results based on query
  useEffect(() => {
    if (searchQuery.length > 0) {
      // Mock search results
      const mockResults = {
        users: [
          { id: 1, username: "user_" + searchQuery, name: "User " + searchQuery, followers: "10.5K", avatar: "" },
          { id: 2, username: searchQuery + "_official", name: searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1), followers: "5.2K", avatar: "" },
        ],
        hashtags: [
          { id: 1, name: searchQuery, count: "1.2M", videos: 12500 },
          { id: 2, name: searchQuery + "challenge", count: "986K", videos: 8700 },
        ],
        videos: [
          { id: 1, title: "Amazing " + searchQuery + " video", views: "1.2M", duration: "0:45", thumbnail: "" },
          { id: 2, title: "How to " + searchQuery, views: "567K", duration: "2:30", thumbnail: "" },
        ],
        sounds: [
          { id: 1, title: searchQuery + " remix", artist: "DJ " + searchQuery, uses: "10.5K", duration: "0:30" },
          { id: 2, title: "Original " + searchQuery, artist: searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1), uses: "5.2K", duration: "1:15" },
        ],
        lives: [
          { id: 1, title: "Live " + searchQuery + " event", viewers: "1.2K", username: "user_" + searchQuery, avatar: "" },
          { id: 2, title: searchQuery + " streaming now", viewers: "756", username: searchQuery + "_official", avatar: "" },
        ],
      };
      
      setResults(mockResults);
    }
  }, [searchQuery]);

  const renderUsers = () => (
    <div className="space-y-2">
      {results.users.map((user) => (
        <Card key={user.id} className="bg-app-gray-dark border-none p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Avatar className="mr-3">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-app-gray text-app-yellow">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">@{user.username}</h3>
                <p className="text-xs text-gray-400">{user.name} • {user.followers} followers</p>
              </div>
            </div>
            <Badge className="bg-app-yellow text-app-black">Follow</Badge>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderHashtags = () => (
    <div className="space-y-2">
      {results.hashtags.map((tag) => (
        <Card key={tag.id} className="bg-app-gray-dark border-none p-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-app-gray flex items-center justify-center mr-3">
                <Hash className="h-5 w-5 text-app-yellow" />
              </div>
              <div>
                <h3 className="font-medium">#{tag.name}</h3>
                <p className="text-xs text-gray-400">{tag.count} views • {tag.videos} videos</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-2">
      {results.videos.map((video) => (
        <Card key={video.id} className="bg-app-gray-dark border-none p-3">
          <div className="flex">
            <div className="w-24 h-16 bg-app-gray rounded-md mr-3 flex items-center justify-center">
              <Video className="h-6 w-6 text-app-yellow" />
            </div>
            <div>
              <h3 className="font-medium">{video.title}</h3>
              <p className="text-xs text-gray-400">{video.views} views • {video.duration}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderSounds = () => (
    <div className="space-y-2">
      {results.sounds.map((sound) => (
        <Card key={sound.id} className="bg-app-gray-dark border-none p-3">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-app-gray flex items-center justify-center mr-3">
              <Mic className="h-5 w-5 text-app-yellow" />
            </div>
            <div>
              <h3 className="font-medium">{sound.title}</h3>
              <p className="text-xs text-gray-400">By {sound.artist} • {sound.uses} uses • {sound.duration}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderLives = () => (
    <div className="space-y-2">
      {results.lives.map((live) => (
        <Card key={live.id} className="bg-app-gray-dark border-none p-3">
          <div className="flex">
            <div className="w-24 h-16 bg-app-gray rounded-md mr-3 flex items-center justify-center relative">
              <Activity className="h-6 w-6 text-app-yellow" />
              <Badge className="absolute bottom-1 left-1 bg-red-500 text-white text-xs">LIVE</Badge>
            </div>
            <div>
              <h3 className="font-medium">{live.title}</h3>
              <p className="text-xs text-gray-400">@{live.username} • {live.viewers} viewers</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="mt-2">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-app-gray-dark overflow-x-auto no-scrollbar">
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
          <TabsTrigger value="hashtags" className="flex-1">Hashtags</TabsTrigger>
          <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
          <TabsTrigger value="sounds" className="flex-1">Sounds</TabsTrigger>
          <TabsTrigger value="lives" className="flex-1">Lives</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4 space-y-6">
          {results.users.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Users</h2>
              </div>
              {renderUsers()}
            </div>
          )}
          
          {results.hashtags.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Hashtags</h2>
              </div>
              {renderHashtags()}
            </div>
          )}
          
          {results.videos.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Videos</h2>
              </div>
              {renderVideos()}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="users" className="mt-4">
          {renderUsers()}
        </TabsContent>
        
        <TabsContent value="hashtags" className="mt-4">
          {renderHashtags()}
        </TabsContent>
        
        <TabsContent value="videos" className="mt-4">
          {renderVideos()}
        </TabsContent>
        
        <TabsContent value="sounds" className="mt-4">
          {renderSounds()}
        </TabsContent>
        
        <TabsContent value="lives" className="mt-4">
          {renderLives()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchResults;
