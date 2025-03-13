
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Grid, Lock, Settings, Edit2 } from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("videos");

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-app-black">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-app-gray-dark to-app-gray-light"></div>
        <div className="absolute -bottom-16 w-full flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-app-black overflow-hidden">
            <img
              src={user.avatar || "https://via.placeholder.com/150"}
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
            <span className="text-xl font-bold">{user.followers}</span>
            <span className="text-sm text-gray-400">Followers</span>
          </div>
          <div className="profile-stat">
            <span className="text-xl font-bold">{user.following}</span>
            <span className="text-sm text-gray-400">Following</span>
          </div>
          <div className="profile-stat">
            <span className="text-xl font-bold">{user.coins}</span>
            <span className="text-sm text-gray-400">Coins</span>
          </div>
        </div>

        <div className="flex gap-3 mt-4 w-full justify-center">
          <Button variant="outline" className="bg-transparent border-app-yellow text-app-yellow hover:bg-app-yellow hover:text-app-black">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
          <Button variant="outline" className="bg-transparent border-app-yellow text-app-yellow hover:bg-app-yellow hover:text-app-black" onClick={logout}>
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>
        </div>

        <Tabs defaultValue="videos" className="w-full mt-8">
          <TabsList className="w-full bg-app-gray-dark">
            <TabsTrigger value="videos" className="flex-1">Videos</TabsTrigger>
            <TabsTrigger value="liked" className="flex-1">Liked</TabsTrigger>
            <TabsTrigger value="private" className="flex-1">Private</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-4">
            <div className="grid grid-cols-3 gap-1">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="aspect-[9/16] bg-app-gray-light flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={`https://picsum.photos/id/${10 + i}/300/500`} 
                    alt={`Video thumbnail ${i}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-2 left-2 flex items-center text-white text-xs">
                    <Grid className="w-3 h-3 mr-1" />
                    <span>{(i + 1) * 103}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="liked" className="mt-4">
            <div className="grid grid-cols-3 gap-1">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="aspect-[9/16] bg-app-gray-light flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={`https://picsum.photos/id/${20 + i}/300/500`} 
                    alt={`Liked video thumbnail ${i}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-2 left-2 flex items-center text-white text-xs">
                    <Grid className="w-3 h-3 mr-1" />
                    <span>{(i + 1) * 75}</span>
                  </div>
                </div>
              ))}
            </div>
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
