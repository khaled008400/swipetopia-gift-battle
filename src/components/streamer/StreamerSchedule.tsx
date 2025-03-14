
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Check,
  X,
  Video,
  Swords
} from "lucide-react";

interface ScheduledStream {
  id: string;
  title: string;
  description?: string;
  scheduled_time: string;
  is_battle: boolean;
  opponent_id?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
}

interface StreamInvite {
  id: string;
  sender_id: string;
  sender_username: string;
  sender_avatar?: string;
  title: string;
  scheduled_time: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const StreamerSchedule = () => {
  const { user } = useAuth();
  const [scheduledStreams, setScheduledStreams] = useState<ScheduledStream[]>([]);
  const [invites, setInvites] = useState<StreamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSchedule();
    }
  }, [user]);

  const fetchSchedule = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch scheduled streams
      const { data: streamsData, error: streamsError } = await supabase
        .from('scheduled_streams')
        .select('*')
        .eq('streamer_id', user.id)
        .order('scheduled_time', { ascending: true });

      if (streamsError) throw streamsError;
      
      setScheduledStreams(streamsData || []);
      
      // In a real app, you would fetch battle invites from a different table
      // For now, we'll use mock data
      setInvites([
        {
          id: '1',
          sender_id: 'user123',
          sender_username: 'FashionStar',
          sender_avatar: 'https://i.pravatar.cc/150?u=fashionista',
          title: 'Fashion Battle: Summer Edition',
          scheduled_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        {
          id: '2',
          sender_id: 'user456',
          sender_username: 'CookingMaster',
          sender_avatar: 'https://i.pravatar.cc/150?u=cookingmaster',
          title: 'Cooking Challenge: Desserts',
          scheduled_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        }
      ]);
      
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast({
        title: "Error",
        description: "Failed to load your scheduled streams.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteResponse = async (inviteId: string, accept: boolean) => {
    try {
      // In a real app, you would update the invitation in the database
      // For now, we'll just update the state
      setInvites(invites.map(invite => 
        invite.id === inviteId 
          ? { ...invite, status: accept ? 'accepted' : 'rejected' } 
          : invite
      ));
      
      toast({
        title: accept ? "Invitation Accepted" : "Invitation Declined",
        description: accept 
          ? "The battle has been added to your schedule." 
          : "You have declined the battle invitation.",
      });
      
      // If accepted, add to scheduled streams
      if (accept) {
        const acceptedInvite = invites.find(invite => invite.id === inviteId);
        if (acceptedInvite && user) {
          const newStream: ScheduledStream = {
            id: `new-${Date.now()}`,
            title: acceptedInvite.title,
            scheduled_time: acceptedInvite.scheduled_time,
            is_battle: true,
            opponent_id: acceptedInvite.sender_id,
            status: 'scheduled'
          };
          
          setScheduledStreams([...scheduledStreams, newStream]);
        }
      }
    } catch (error) {
      console.error("Error responding to invite:", error);
      toast({
        title: "Error",
        description: "Failed to process your response.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        
        <Skeleton className="h-[300px] w-full" />
        
        <Skeleton className="h-8 w-[200px] mt-8" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scheduled Streams */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Upcoming Streams</h2>
        <Button className="bg-app-yellow text-app-black hover:bg-app-yellow/90">
          <Plus className="mr-2 h-4 w-4" /> Schedule Stream
        </Button>
      </div>
      
      <Card className="bg-app-gray-dark border-app-gray-light">
        <CardContent className="p-6">
          {scheduledStreams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You don't have any scheduled streams.</p>
              <Button className="bg-app-yellow text-app-black hover:bg-app-yellow/90">
                <Plus className="mr-2 h-4 w-4" /> Schedule Your First Stream
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledStreams.map((stream) => {
                const scheduledDate = new Date(stream.scheduled_time);
                const isLive = stream.status === 'live';
                const isPast = scheduledDate < new Date();
                
                return (
                  <div 
                    key={stream.id}
                    className={`p-4 border rounded-lg ${
                      isLive ? 'border-green-500 bg-green-900/20' : 
                      isPast ? 'border-gray-600 bg-gray-800/20' : 
                      'border-app-gray-light'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          {stream.is_battle ? (
                            <Swords className="h-5 w-5 mr-2 text-purple-400" />
                          ) : (
                            <Video className="h-5 w-5 mr-2 text-blue-400" />
                          )}
                          <h3 className="font-semibold text-white">{stream.title}</h3>
                          
                          {isLive && (
                            <Badge className="ml-3 bg-green-500 text-white">LIVE NOW</Badge>
                          )}
                          
                          {stream.status === 'cancelled' && (
                            <Badge className="ml-3 bg-red-500 text-white">CANCELLED</Badge>
                          )}
                          
                          {stream.status === 'completed' && (
                            <Badge className="ml-3 bg-gray-500 text-white">COMPLETED</Badge>
                          )}
                        </div>
                        
                        {stream.description && (
                          <p className="text-sm text-gray-400 mb-3">{stream.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-y-2">
                          <div className="flex items-center mr-4 text-sm text-gray-300">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {scheduledDate.toLocaleDateString()}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-300">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      
                      {!isPast && stream.status !== 'cancelled' && (
                        <div>
                          <Button size="sm" variant="outline" className="mr-2">Edit</Button>
                          {isLive ? (
                            <Button size="sm" className="bg-green-500 hover:bg-green-600">
                              Join Live
                            </Button>
                          ) : (
                            <Button size="sm" variant="destructive">Cancel</Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Battle Invites */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Battle Invitations</h2>
      
      <Card className="bg-app-gray-dark border-app-gray-light">
        <CardContent className="p-6">
          {invites.filter(i => i.status === 'pending').length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400">You don't have any pending battle invitations.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invites
                .filter(invite => invite.status === 'pending')
                .map((invite) => {
                  const inviteDate = new Date(invite.scheduled_time);
                  
                  return (
                    <div key={invite.id} className="p-4 border border-purple-500/30 bg-purple-900/10 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            <Swords className="h-5 w-5 mr-2 text-purple-400" />
                            <h3 className="font-semibold text-white">{invite.title}</h3>
                            <Badge className="ml-3 bg-purple-500 text-white">INVITATION</Badge>
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-3">
                            <strong>{invite.sender_username}</strong> has invited you to a battle
                          </p>
                          
                          <div className="flex flex-wrap gap-y-2">
                            <div className="flex items-center mr-4 text-sm text-gray-300">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              {inviteDate.toLocaleDateString()}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-300">
                              <Clock className="h-4 w-4 mr-1 text-gray-400" />
                              {inviteDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600 mr-2"
                            onClick={() => handleInviteResponse(invite.id, true)}
                          >
                            <Check className="h-4 w-4 mr-1" /> Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleInviteResponse(invite.id, false)}
                          >
                            <X className="h-4 w-4 mr-1" /> Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamerSchedule;
