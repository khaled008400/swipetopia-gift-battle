
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Plus, Swords, Mail, Check, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock data - would come from API in production
const mockScheduledStreams = [
  {
    id: "1",
    title: "New Summer Collection",
    description: "Showcasing our new summer fashion line with exclusive discounts.",
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    duration: 60, // minutes
    status: "scheduled"
  },
  {
    id: "2",
    title: "Tech Gadgets Review",
    description: "Reviewing the latest tech gadgets and accessories with special offers.",
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    duration: 45, // minutes
    status: "scheduled"
  },
];

const mockBattleInvites = [
  {
    id: "1",
    from: { username: "fashionista", avatar: "https://i.pravatar.cc/150?u=fashionista" },
    date: new Date(Date.now() + 86400000 * 1), // 1 day from now
    duration: 30, // minutes
    message: "Let's battle to see who has the best summer fashion collection!",
    status: "pending"
  },
  {
    id: "2",
    from: { username: "techguy", avatar: "https://i.pravatar.cc/150?u=techguy" },
    date: new Date(Date.now() + 86400000 * 3), // 3 days from now
    duration: 45, // minutes
    message: "Tech gadgets showdown! Let's see who has the coolest gear!",
    status: "pending"
  },
];

const StreamerSchedule = () => {
  const [activeTab, setActiveTab] = useState("scheduled");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Schedule & Invites</h2>
          <p className="text-sm text-muted-foreground">
            Manage your upcoming streams and battle invitations
          </p>
        </div>
        
        <Button className="bg-app-yellow text-app-black">
          <Plus className="mr-2 h-4 w-4" /> Schedule Stream
        </Button>
      </div>
      
      <Tabs 
        defaultValue="scheduled" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="scheduled">
            Scheduled Streams {mockScheduledStreams.length > 0 && `(${mockScheduledStreams.length})`}
          </TabsTrigger>
          <TabsTrigger value="invites">
            Battle Invites {mockBattleInvites.length > 0 && `(${mockBattleInvites.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheduled" className="mt-0">
          {mockScheduledStreams.length === 0 ? (
            <Card className="bg-app-gray-dark">
              <CardContent className="pt-6 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">No scheduled streams</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any upcoming streams scheduled yet.
                </p>
                <Button className="bg-app-yellow text-app-black">
                  <Plus className="mr-2 h-4 w-4" /> Schedule Your First Stream
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockScheduledStreams.map((stream) => (
                <Card key={stream.id} className="bg-app-gray-dark">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{stream.title}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{stream.date.toLocaleDateString("en-US", { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}</span>
                          <Clock className="h-4 w-4 ml-3 mr-1" />
                          <span>{stream.duration} minutes</span>
                        </div>
                        <p className="text-sm mt-2">{stream.description}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500">Cancel</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="invites" className="mt-0">
          {mockBattleInvites.length === 0 ? (
            <Card className="bg-app-gray-dark">
              <CardContent className="pt-6 text-center">
                <Swords className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">No battle invites</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any pending battle invitations.
                </p>
                <Button variant="outline">
                  <Swords className="mr-2 h-4 w-4" /> Invite Someone to Battle
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {mockBattleInvites.map((invite) => (
                <Card key={invite.id} className="bg-app-gray-dark">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={invite.from.avatar} />
                        <AvatarFallback>{invite.from.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold">@{invite.from.username}</h3>
                              <Badge className="ml-2 bg-blue-500">Battle Invite</Badge>
                            </div>
                            
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{invite.date.toLocaleDateString("en-US", { 
                                weekday: 'short',
                                month: 'short', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}</span>
                              <Clock className="h-4 w-4 ml-3 mr-1" />
                              <span>{invite.duration} minutes</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Check className="h-4 w-4 mr-1" /> Accept
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500">
                              <X className="h-4 w-4 mr-1" /> Decline
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-app-gray-darker rounded p-3 mt-3 text-sm">
                          <Mail className="h-4 w-4 inline-block mr-2 text-muted-foreground" />
                          <span>{invite.message}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StreamerSchedule;
