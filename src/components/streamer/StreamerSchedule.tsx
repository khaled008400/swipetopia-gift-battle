
import { useState } from "react";
import { Calendar, Clock, Users, Video, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScheduledStreams } from "@/hooks/useStreamerData";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

const StreamerSchedule = () => {
  const { user } = useAuth();
  const { scheduledStreams, isLoading, error } = useScheduledStreams(user?.id || '');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

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
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4 mr-2" /> Schedule Stream
          </Button>
          <Button className="bg-app-yellow text-app-black hover:bg-app-yellow/90">
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
                    <Button variant="outline" size="sm">
                      <Clock className="h-4 w-4 mr-2" /> Reschedule
                    </Button>
                    <Button variant="default" size="sm" className="bg-app-yellow text-app-black hover:bg-app-yellow/90">
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
            <Button onClick={() => setInviteModalOpen(true)}>
              Send Battle Invites
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamerSchedule;
