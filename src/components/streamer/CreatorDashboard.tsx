
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StreamHistory from "./StreamHistory";
import BattleStats from "./BattleStats";
import StreamerSchedule from "./StreamerSchedule";

const CreatorDashboard = () => {
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
