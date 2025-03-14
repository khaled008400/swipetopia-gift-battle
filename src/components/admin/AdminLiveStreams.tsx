
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { LiveStream } from '@/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, MoreHorizontal, Search, Video, VideoOff, 
  User, Gift, Timer, TrendingUp, MessageSquare, ShieldX 
} from 'lucide-react';

const AdminLiveStreams = () => {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [shutdownDialogOpen, setShutdownDialogOpen] = useState(false);
  const [shutdownReason, setShutdownReason] = useState('');
  const [activeTab, setActiveTab] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current live streams
  const { data: liveStreams, isLoading } = useQuery({
    queryKey: ['adminLiveStreams', activeTab, searchQuery],
    queryFn: () => AdminService.getLiveStreams(activeTab, searchQuery),
    refetchInterval: 10000, // Poll every 10 seconds for live data
  });

  // Shutdown stream mutation
  const shutdownStreamMutation = useMutation({
    mutationFn: ({ streamId, reason }: { streamId: string, reason: string }) => 
      AdminService.shutdownStream(streamId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLiveStreams'] });
      toast({
        title: "Stream shutdown",
        description: "Live stream has been shut down successfully.",
      });
      setShutdownDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to shut down the stream.",
        variant: "destructive",
      });
    },
  });

  // Send message to streamer mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ streamId, message }: { streamId: string, message: string }) => 
      AdminService.sendStreamMessage(streamId, message),
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Message has been sent to the streamer.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    },
  });

  const handleShutdownStream = () => {
    if (selectedStream && shutdownReason.trim() !== '') {
      shutdownStreamMutation.mutate({ 
        streamId: selectedStream.id, 
        reason: shutdownReason 
      });
    }
  };

  const handleSendMessage = (streamId: string, message: string) => {
    if (message.trim() !== '') {
      sendMessageMutation.mutate({ streamId, message });
    }
  };

  const formatDuration = (durationMinutes: number) => {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the state change and query refetch
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Streaming Management</h2>
        <div className="flex space-x-2">
          <form onSubmit={handleSearch} className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search streamers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="current">Current Streams</TabsTrigger>
          <TabsTrigger value="ended">Ended Streams</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Streams</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Streams</CardTitle>
                <CardDescription>Total live streams right now</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : liveStreams?.stats.activeCount || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Viewers</CardTitle>
                <CardDescription>Viewers across all streams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : liveStreams?.stats.totalViewers || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Gift Revenue</CardTitle>
                <CardDescription>Today's earnings from gifts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${liveStreams?.stats.totalGiftRevenue.toFixed(2) || '0.00'}`}
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Streamer</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Viewers</TableHead>
                  <TableHead>Gifts</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveStreams?.data.map((stream: LiveStream) => (
                  <TableRow key={stream.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-500">LIVE</Badge>
                        {stream.user.username}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{stream.title}</TableCell>
                    <TableCell>{formatDuration(stream.durationMinutes)}</TableCell>
                    <TableCell>{stream.currentViewers}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{stream.giftsReceived} gifts</span>
                        <span className="text-xs text-muted-foreground">Top: {stream.topGiftName}</span>
                      </div>
                    </TableCell>
                    <TableCell>${stream.revenue.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedStream(stream);
                            setShutdownDialogOpen(true);
                          }}
                          className="text-red-600"
                        >
                          <VideoOff className="mr-1 h-4 w-4" />
                          Shutdown
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleSendMessage(stream.id, "Please follow community guidelines")}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Warning
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedStream(stream);
                                setShutdownDialogOpen(true);
                              }}
                              className="text-red-600"
                            >
                              <ShieldX className="mr-2 h-4 w-4" />
                              Ban User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {liveStreams?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No active streams at the moment
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="ended" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Streamer</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Ended At</TableHead>
                  <TableHead>Peak Viewers</TableHead>
                  <TableHead>Gifts</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveStreams?.data.map((stream: LiveStream) => (
                  <TableRow key={stream.id}>
                    <TableCell className="font-medium">{stream.user.username}</TableCell>
                    <TableCell className="max-w-xs truncate">{stream.title}</TableCell>
                    <TableCell>{formatDuration(stream.durationMinutes)}</TableCell>
                    <TableCell>{new Date(stream.endedAt).toLocaleString()}</TableCell>
                    <TableCell>{stream.peakViewers}</TableCell>
                    <TableCell>{stream.giftsReceived}</TableCell>
                    <TableCell>${stream.revenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {liveStreams?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No ended streams found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Streamer</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Expected Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveStreams?.data.map((stream: LiveStream) => (
                  <TableRow key={stream.id}>
                    <TableCell className="font-medium">{stream.user.username}</TableCell>
                    <TableCell className="max-w-xs truncate">{stream.title}</TableCell>
                    <TableCell>{new Date(stream.scheduledFor).toLocaleString()}</TableCell>
                    <TableCell>{formatDuration(stream.plannedDurationMinutes)}</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500">Scheduled</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSendMessage(stream.id, "Your scheduled stream has been reviewed and approved.")}
                      >
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Message
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {liveStreams?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No scheduled streams found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>

      {/* Shutdown Stream Dialog */}
      <Dialog open={shutdownDialogOpen} onOpenChange={setShutdownDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Shutdown Live Stream</DialogTitle>
            <DialogDescription>
              {selectedStream && (
                <span>
                  You are about to shutdown the live stream by <strong>{selectedStream.user.username}</strong>.
                  This will immediately end their broadcast.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="shutdown-reason" className="text-sm font-medium">
                Reason for shutdown <span className="text-red-500">*</span>
              </label>
              <Input
                id="shutdown-reason"
                placeholder="Violation of community guidelines..."
                value={shutdownReason}
                onChange={(e) => setShutdownReason(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This reason will be sent to the streamer and logged in the system.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShutdownDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleShutdownStream}
              disabled={!shutdownReason.trim() || shutdownStreamMutation.isPending}
            >
              {shutdownStreamMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Shutdown Stream
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLiveStreams;
