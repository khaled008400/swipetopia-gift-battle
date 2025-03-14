
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StreamHistory from "./StreamHistory";
import BattleStats from "./BattleStats";
import StreamerSchedule from "./StreamerSchedule";
import StreamHighlights from "./StreamHighlights";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [hasStreamRole, setHasStreamRole] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if the user has the streamer role
    if (user) {
      setHasStreamRole(user.roles?.includes("streamer") || user.roles?.includes("admin") || false);
    }
  }, [user]);

  const handleApplyToStream = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Update the user profile to add a streamer role request
      const { error } = await supabase
        .from('profiles')
        .update({ 
          streamer_application: true,
          streamer_application_date: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your application to become a streamer has been submitted for review.",
      });
    } catch (error) {
      console.error("Error applying to stream:", error);
      toast({
        title: "Error",
        description: "Failed to submit your application. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Button 
            className="bg-app-yellow text-app-black px-4 py-2 rounded font-medium"
            onClick={handleApplyToStream}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Apply to Stream"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Creator Dashboard</h1>
      
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="history">Stream History</TabsTrigger>
          <TabsTrigger value="battles">Battle Stats</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Invites</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-6">
          <StreamHistory streamerId={user?.id} />
        </TabsContent>
        
        <TabsContent value="battles" className="mt-6">
          <BattleStats streamerId={user?.id} />
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-6">
          <StreamerSchedule streamerId={user?.id} />
        </TabsContent>
        
        <TabsContent value="highlights" className="mt-6">
          <StreamHighlights streamerId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDashboard;
