
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService from '@/services/admin.service';
import { LiveStream } from '@/types/livestream.types';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  MessageSquare, XCircle, Loader2, VideoOff, Eye, 
  Calendar, AlarmCheck, User, Clock, Users, GiftIcon, DollarSign
} from 'lucide-react';

const AdminLiveStreams: React.FC = () => {
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [shutdownDialogOpen, setShutdownDialogOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [message, setMessage] = useState('');
  const [shutdownReason, setShutdownReason] = useState('');
  const [activeTab, setActiveTab] = useState('live');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch live streams
  const { data: streams, isLoading } = useQuery({
    queryKey: ['adminLiveStreams'],
    queryFn: () => AdminService.getLiveStreams(),
  });
  
  // Shutdown stream mutation
  const shutdownMutation = useMutation({
    mutationFn: (data: { streamId: string, reason: string }) => 
      AdminService.shutdownStream(data.streamId, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLiveStreams'] });
      toast({
        title: "Stream stopped",
        description: "The live stream has been shut down successfully.",
      });
      setShutdownDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: { streamId: string, message: string }) => 
      AdminService.sendStreamMessage(data.streamId, data.message),
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the stream.",
      });
      setMessageDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleOpenMessageDialog = (stream: LiveStream) => {
    setSelectedStream(stream);
    setMessage('');
    setMessageDialogOpen(true);
  };

  const handleOpenShutdownDialog = (stream: LiveStream) => {
    setSelectedStream(stream);
    setShutdownReason('');
    setShutdownDialogOpen(true);
  };

  const handleSendMessage = () => {
    if (selectedStream && message.trim()) {
      sendMessageMutation.mutate({
        streamId: selectedStream.id,
        message: message.trim()
      });
    }
  };

  const handleShutdownStream = () => {
    if (selectedStream && shutdownReason.trim()) {
      shutdownMutation.mutate({
        streamId: selectedStream.id,
        reason: shutdownReason.trim()
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const liveStreams = streams?.filter(stream => !stream.endedAt && !stream.scheduledFor) || [];
  const endedStreams = streams?.filter(stream => stream.endedAt) || [];
  const scheduledStreams = streams?.filter(stream => stream.scheduledFor) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Streams</h2>
        <div>
          <Input 
            placeholder="Search streams..." 
            className="max-w-xs" 
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="live">
            Live Now 
            {liveStreams.length > 0 && <Badge className="ml-2 bg-red-500">{liveStreams.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="ended">Recent Streams</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="live" className="space-y-4">
          {liveStreams.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stream</TableHead>
                  <TableHead>Streamer</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Viewers</TableHead>
                  <TableHead>Gifts</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveStreams.map((stream) => (
                  <TableRow key={stream.id}>
                    <TableCell>
                      <div className="font-medium">{stream.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Started {format(new Date(stream.started_at), 'MMM d, h:mm a')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img 
                            src={stream.user?.avatar_url || stream.avatar_url || "/placeholder-avatar.jpg"} 
                            alt={stream.user?.username || stream.username} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span>{stream.user?.username || stream.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>{stream.durationMinutes || Math.floor((Date.now() - new Date(stream.started_at).getTime()) / 60000)} mins</TableCell>
                    <TableCell>{stream.currentViewers || stream.viewer_count}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <GiftIcon className="h-4 w-4 mr-1 text-pink-500" />
                        {stream.giftsReceived || 0}
                        {stream.topGiftName && <span className="text-xs ml-1">Top: {stream.topGiftName}</span>}
                      </div>
                    </TableCell>
                    <TableCell>${stream.revenue || 0}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleOpenMessageDialog(stream)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleOpenShutdownDialog(stream)}
                        >
                          <VideoOff className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <p className="text-lg font-medium">No Live Streams Right Now</p>
                <p className="text-muted-foreground">There are currently no active streams.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="ended" className="space-y-4">
          {endedStreams.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stream</TableHead>
                  <TableHead>Streamer</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Peak Viewers</TableHead>
                  <TableHead>Gifts</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endedStreams.map((stream) => (
                  <TableRow key={stream.id}>
                    <TableCell>
                      <div className="font-medium">{stream.title}</div>
                      <div className="text-xs text-muted-foreground">
                        Started {format(new Date(stream.started_at), 'MMM d, h:mm a')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img 
                            src={stream.user?.avatar_url || stream.avatar_url || "/placeholder-avatar.jpg"} 
                            alt={stream.user?.username || stream.username} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span>{stream.user?.username || stream.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>{stream.durationMinutes || "N/A"} mins</TableCell>
                    <TableCell>{stream.endedAt ? format(new Date(stream.endedAt), 'MMM d, h:mm a') : "N/A"}</TableCell>
                    <TableCell>{stream.peakViewers || stream.viewer_count}</TableCell>
                    <TableCell>{stream.giftsReceived || 0}</TableCell>
                    <TableCell>${stream.revenue || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <p className="text-lg font-medium">No Recent Streams</p>
                <p className="text-muted-foreground">There are no ended streams in the record.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="scheduled" className="space-y-4">
          {scheduledStreams.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stream</TableHead>
                  <TableHead>Streamer</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Planned Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledStreams.map((stream) => (
                  <TableRow key={stream.id}>
                    <TableCell>
                      <div className="font-medium">{stream.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img 
                            src={stream.user?.avatar_url || stream.avatar_url || "/placeholder-avatar.jpg"} 
                            alt={stream.user?.username || stream.username} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span>{stream.user?.username || stream.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>{stream.scheduledFor ? format(new Date(stream.scheduledFor), 'MMM d, h:mm a') : "N/A"}</TableCell>
                    <TableCell>{stream.plannedDurationMinutes || "N/A"} mins</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <p className="text-lg font-medium">No Scheduled Streams</p>
                <p className="text-muted-foreground">There are no upcoming scheduled streams.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Send Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to Stream</DialogTitle>
            <DialogDescription>
              This message will be displayed to the streamer and all viewers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Stream:</span>
              <span>{selectedStream?.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Streamer:</span>
              <span>{selectedStream?.user?.username || selectedStream?.username}</span>
            </div>
            <Textarea
              placeholder="Enter your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Shutdown Stream Dialog */}
      <Dialog open={shutdownDialogOpen} onOpenChange={setShutdownDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shut Down Stream</DialogTitle>
            <DialogDescription>
              This will immediately end the live stream. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Stream:</span>
              <span>{selectedStream?.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Streamer:</span>
              <span>{selectedStream?.user?.username || selectedStream?.username}</span>
            </div>
            <Textarea
              placeholder="Reason for shutting down the stream..."
              value={shutdownReason}
              onChange={(e) => setShutdownReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShutdownDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive"
              onClick={handleShutdownStream}
              disabled={!shutdownReason.trim() || shutdownMutation.isPending}
            >
              {shutdownMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Stopping Stream...
                </>
              ) : (
                <>
                  <VideoOff className="mr-2 h-4 w-4" />
                  Shut Down Stream
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLiveStreams;
