
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StreamHistory from "./StreamHistory";
import BattleStats from "./BattleStats";
import StreamerSchedule from "./StreamerSchedule";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [hasStreamRole, setHasStreamRole] = useState(true);

  useEffect(() => {
    // Check if the user has the streamer role
    if (user) {
      setHasStreamRole(user.roles.includes("streamer") || user.roles.includes("admin"));
    }
  }, [user]);

  // If user doesn't have streamer role, prompt them to become a streamer
  if (!hasStreamRole) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Creator Dashboard</h1>
        
        <div className="bg-app-gray-dark p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Become a Streamer</h2>
          <p className="mb-6 max-w-md mx-auto">
            You need to be a verified streamer to access the Creator Dashboard. Apply now to start streaming!
          </p>
          <button className="bg-app-yellow text-app-black px-4 py-2 rounded font-medium">
            Apply to Stream
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Creator Dashboard</h1>
      
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Stream History</TabsTrigger>
          <TabsTrigger value="battles">Battle Stats</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Invites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-6">
          <StreamHistory />
        </TabsContent>
        
        <TabsContent value="battles" className="mt-6">
          <BattleStats />
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-6">
          <StreamerSchedule />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDashboard;
