
import { useState, useEffect } from "react";
import { Calendar, Clock, Users, Video, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ScheduledStream {
  id: string;
  title: string;
  description: string;
  scheduled_time: string;
  is_battle: boolean;
  opponent_id: string | null;
  status: string;
}

const StreamerSchedule = ({ streamerId }: { streamerId?: string }) => {
  const [scheduledStreams, setScheduledStreams] = useState<ScheduledStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStreamDialog, setShowStreamDialog] = useState(false);
  const [showBattleDialog, setShowBattleDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isBattle, setIsBattle] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchScheduledStreams = async () => {
      if (!streamerId) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("scheduled_streams")
          .select("*")
          .eq("streamer_id", streamerId)
          .gte("scheduled_time", new Date().toISOString())
          .order("scheduled_time", { ascending: true });

        if (error) throw error;
        
        setScheduledStreams(data || []);
      } catch (err) {
        console.error("Error fetching scheduled streams:", err);
        setError("Failed to load scheduled streams");
        toast({
          title: "Error",
          description: "Failed to load stream schedule",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduledStreams();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('scheduled-streams-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'scheduled_streams',
          filter: `streamer_id=eq.${streamerId}`
        }, 
        (payload) => {
          fetchScheduledStreams();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamerId, toast]);

  const handleScheduleStream = async () => {
    if (!streamerId || !title || !scheduledTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("scheduled_streams")
        .insert({
          streamer_id: streamerId,
          title,
          description,
          scheduled_time: new Date(scheduledTime).toISOString(),
          is_battle: isBattle,
          status: 'scheduled'
        })
        .select();

      if (error) throw error;
      
      toast({
        title: "Stream Scheduled",
        description: "Your stream has been scheduled successfully!",
      });
      
      // Reset form and close dialog
      setTitle("");
      setDescription("");
      setScheduledTime("");
      setIsBattle(false);
      setShowStreamDialog(false);
      
    } catch (err) {
      console.error("Error scheduling stream:", err);
      toast({
        title: "Error",
        description: "Failed to schedule stream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReschedule = (stream: ScheduledStream) => {
    // Set form values for editing
    setTitle(stream.title);
    setDescription(stream.description || "");
    setScheduledTime(new Date(stream.scheduled_time).toISOString().slice(0, 16));
    setIsBattle(stream.is_battle);
    setShowStreamDialog(true);
  };

  const handleStartStream = (streamId: string) => {
    // This would navigate to the streaming page
    toast({
      title: "Starting Stream",
      description: "Redirecting to the streaming interface...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Schedule & Invites</h2>
          <p className="text-sm text-muted-foreground">
            Manage your upcoming live streams and battle invitations
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowStreamDialog(true)}
          >
            <Video className="h-4 w-4 mr-2" /> Schedule Stream
          </Button>
          <Button 
            className="bg-app-yellow text-app-black hover:bg-app-yellow/90"
            onClick={() => setShowBattleDialog(true)}
          >
            <Swords className="h-4 w-4 mr-2" /> Create Battle
          </Button>
        </div>
      </div>
      
      <div className="bg-app-gray-dark rounded-md">
        <div className="p-4 border-b border-app-gray-light">
          <h3 className="font-medium">Upcoming Streams</h3>
        </div>
        
        <div className="divide-y divide-app-gray-light">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-64 mb-1" />
                    <div className="flex gap-4 mt-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : scheduledStreams.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No upcoming streams scheduled
            </div>
          ) : (
            scheduledStreams.map((stream) => (
              <div key={stream.id} className="p-4 hover:bg-app-gray-darker transition-colors">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h4 className="font-medium flex items-center">
                      {stream.is_battle && (
                        <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full mr-2">
                          BATTLE
                        </span>
                      )}
                      {stream.title}
                    </h4>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {stream.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center mt-2 text-sm text-muted-foreground gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-app-yellow" />
                        {new Date(stream.scheduled_time).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-app-yellow" />
                        {new Date(stream.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReschedule(stream)}
                    >
                      <Clock className="h-4 w-4 mr-2" /> Reschedule
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-app-yellow text-app-black hover:bg-app-yellow/90"
                      onClick={() => handleStartStream(stream.id)}
                    >
                      <Video className="h-4 w-4 mr-2" /> Start Stream
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <Card className="bg-app-gray-dark border-app-gray-light">
        <CardContent className="p-4">
          <div className="text-center p-6">
            <Users className="h-12 w-12 mx-auto mb-3 text-app-yellow" />
            <h3 className="text-lg font-medium mb-2">Invite Streamers to Battle</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Challenge other creators to a PK battle and grow your audience together!
            </p>
            <Button onClick={() => setShowBattleDialog(true)}>
              Send Battle Invites
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Schedule Stream Dialog */}
      <Dialog open={showStreamDialog} onOpenChange={setShowStreamDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule a Stream</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Stream Title</Label>
              <Input
                id="title"
                placeholder="Enter your stream title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="What will you be streaming about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Date and Time</Label>
              <Input
                id="scheduledTime"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isBattle"
                checked={isBattle}
                onCheckedChange={setIsBattle}
              />
              <Label htmlFor="isBattle">This is a battle stream</Label>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleScheduleStream} 
              disabled={isSubmitting}
              className="bg-app-yellow text-app-black hover:bg-app-yellow/90"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Stream"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Battle Dialog - placeholder for now */}
      <Dialog open={showBattleDialog} onOpenChange={setShowBattleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a Battle</DialogTitle>
          </DialogHeader>
          
          <div className="p-4 text-center text-muted-foreground">
            Battle creation feature coming soon!
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StreamerSchedule;
