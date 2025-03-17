import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, Zap } from 'lucide-react';
import { LiveStream } from '@/services/streaming/stream.types';
import { StreamService } from '@/services/streaming';

const formatViewers = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const LivePage = () => {
  const [activeTab, setActiveTab] = useState('live');
  const navigate = useNavigate();
  
  const { data: streams, isLoading } = useQuery({
    queryKey: ['liveStreams'],
    queryFn: () => StreamService.getLiveStreams(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Filter streams based on active tab
  const filteredStreams = streams?.filter(stream => {
    if (activeTab === 'live') {
      return stream.status === 'online';
    } else if (activeTab === 'upcoming') {
      return stream.scheduledFor !== undefined;
    } else if (activeTab === 'ended') {
      return stream.status === 'offline' && !stream.scheduledFor;
    }
    return true;
  });
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Live Streams</h1>
        <Button onClick={() => navigate('/go-live')} className="bg-primary">
          <Zap className="mr-2 h-4 w-4" />
          Go Live
        </Button>
      </div>
      
      <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-40 bg-slate-200 animate-pulse"></div>
                  <CardContent className="p-4">
                    <div className="h-4 w-3/4 bg-slate-200 animate-pulse mb-2"></div>
                    <div className="h-4 w-1/2 bg-slate-200 animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredStreams && filteredStreams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStreams.map((stream: LiveStream) => (
                <StreamCard 
                  key={stream.id} 
                  stream={stream} 
                  mode={activeTab as 'live' | 'upcoming' | 'ended'} 
                  onClick={() => navigate(`/stream/${stream.id}`)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-4">No streams available</p>
              {activeTab === 'live' && (
                <p className="text-muted-foreground">
                  No one is streaming right now. Why not start your own stream?
                </p>
              )}
              {activeTab === 'upcoming' && (
                <p className="text-muted-foreground">
                  No upcoming streams scheduled. Check back later or schedule your own.
                </p>
              )}
              {activeTab === 'ended' && (
                <p className="text-muted-foreground">
                  No previous streams found. Start streaming to build your history.
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StreamCardProps {
  stream: LiveStream;
  mode: 'live' | 'upcoming' | 'ended';
  onClick: () => void;
}

const StreamCard: React.FC<StreamCardProps> = ({ stream, mode, onClick }) => {
  const getCardContent = () => {
    if (mode === 'live') {
      return (
        <>
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-500 text-white">
              <Zap className="h-3 w-3 mr-1" /> LIVE
            </Badge>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {formatViewers(stream.viewer_count || 0)}
          </div>
        </>
      );
    } else if (mode === 'upcoming') {
      return (
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {stream.scheduledFor ? new Date(stream.scheduledFor).toLocaleDateString() : 'Upcoming'}
        </div>
      );
    } else {
      return (
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs flex items-center">
          {stream.endedAt ? `${stream.durationMinutes} min` : 'Ended'}
        </div>
      );
    }
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="relative">
        <img 
          src={stream.thumbnail_url || '/placeholder-stream.jpg'} 
          alt={stream.title}
          className="w-full h-40 object-cover" 
        />
        {getCardContent()}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-base line-clamp-1">{stream.title}</h3>
        <div className="flex items-center mt-2">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={stream.avatar_url || stream.user?.avatar_url} />
            <AvatarFallback>{stream.username?.charAt(0) || stream.user?.username.charAt(0) || '?'}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{stream.username || stream.user?.username}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePage;
