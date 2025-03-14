
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatorDashboard from "@/components/streamer/CreatorDashboard";
import PublicProfile from "@/components/streamer/PublicProfile";
import { useAuth } from "@/context/AuthContext";

const StreamerProfilePage = () => {
  const { streamerId } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("public");
  
  const isOwnProfile = user?.id === streamerId;
  
  return (
    <div className="container mx-auto max-w-6xl py-6 px-4">
      <Tabs 
        defaultValue={isOwnProfile ? "dashboard" : "public"}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="public">Public Profile</TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger value="dashboard">Creator Dashboard</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="public" className="mt-0">
          <PublicProfile streamerId={streamerId} />
        </TabsContent>
        
        {isOwnProfile && (
          <TabsContent value="dashboard" className="mt-0">
            <CreatorDashboard />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default StreamerProfilePage;
