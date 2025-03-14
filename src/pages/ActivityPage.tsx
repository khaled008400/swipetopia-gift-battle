
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  Activity, 
  Heart, 
  MessageSquare, 
  Share2, 
  ShoppingBag,
  ChevronRight
} from "lucide-react";
import ActivityHeader from "@/components/activity/ActivityHeader";
import ActivityList from "@/components/activity/ActivityList";
import ActivityStats from "@/components/activity/ActivityStats";

const ActivityPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-app-black text-white overflow-auto pb-20">
      <ActivityHeader />
      
      <div className="p-4">
        <ActivityStats />
        
        <Tabs defaultValue="all" className="w-full mt-6" onValueChange={setActiveTab}>
          <TabsList className="w-full bg-app-gray-dark">
            <TabsTrigger value="all" className="flex-1">All Activity</TabsTrigger>
            <TabsTrigger value="interactions" className="flex-1">Interactions</TabsTrigger>
            <TabsTrigger value="purchases" className="flex-1">Purchases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <ActivityList type="all" />
          </TabsContent>
          
          <TabsContent value="interactions" className="mt-4">
            <ActivityList type="interactions" />
          </TabsContent>
          
          <TabsContent value="purchases" className="mt-4">
            <ActivityList type="purchases" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ActivityPage;
