
import React, { useState, useEffect } from 'react';
import { Shield, Users, Zap } from 'lucide-react';
import AgoraVideoStream from './AgoraVideoStream';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { StreamService } from '@/services/streaming';
import { supabase } from '@/integrations/supabase/client';
import { LiveStream } from '@/types/livestream.types';

interface StreamerBroadcastProps {
  streamerId: string;
  streamerName: string;
}

const StreamerBroadcast: React.FC<StreamerBroadcastProps> = ({ 
  streamerId, 
  streamerName 
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamStatus, setStreamStatus] = useState<'online' | 'offline' | 'live' | 'scheduled'>('offline');
  const { toast } = useToast();

  useEffect(() => {
    if (!streamId) return;

    // Setup realtime subscription to stream status changes
    const channel = supabase.channel(`livestream:${streamId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'streams',
          filter: `id=eq.${streamId}`
        },
        (payload) => {
          if (payload.new) {
            const newStreamData = payload.new as LiveStream;
            setViewerCount(newStreamData.viewer_count || 0);
            setStreamStatus(newStreamData.status);
            
            // If stream was ended remotely (by admin or system)
            if (newStreamData.status === 'offline' && isStreaming) {
              setIsStreaming(false);
              toast({
                title: "Stream Ended",
                description: "Your stream has been ended",
                variant: "destructive"
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamId, isStreaming, toast]);

  const startBroadcast = async () => {
    try {
      // Start a stream in the database
      const newStream = await StreamService.startStream(
        `${streamerName}'s Live Stream`,
        `Live stream by ${streamerName}`
      );
      
      if (newStream) {
        setStreamId(newStream.id);
        setIsStreaming(true);
        setStreamStatus('online');
        
        toast({
          title: "Stream Started",
          description: "You are now live!",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error starting stream:", error);
      toast({
        title: "Error",
        description: "Failed to start stream. Please try again.",
        variant: "destructive"
      });
    }
  };

  const endBroadcast = async () => {
    if (!streamId) return;
    
    try {
      // End the stream in the database
      await StreamService.endStream(streamId);
      
      setIsStreaming(false);
      setStreamStatus('offline');
      
      toast({
        title: "Stream Ended",
        description: "Your stream has ended successfully",
        duration: 3000
      });
    } catch (error) {
      console.error("Error ending stream:", error);
      toast({
        title: "Error",
        description: "Failed to end stream properly",
        variant: "destructive"
      });
    }
  };

  // Simulate viewer count change (in a real app, this would come from a real-time database)
  React.useEffect(() => {
    if (!isStreaming) return;
    
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and +2
        return Math.max(1, prev + change); // Ensure at least 1 viewer
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="flex-1 relative overflow-hidden border-0">
        {isStreaming ? (
          <>
            <AgoraVideoStream 
              streamId={streamId || streamerId} 
              role="host"
            />
            
            {/* Stream info overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
              <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-none px-3 py-1.5">
                <Zap className="h-4 w-4 text-red-500 mr-1" />
                LIVE
              </Badge>
              
              <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-none px-3 py-1.5">
                <Users className="h-4 w-4 mr-1" />
                {viewerCount}
              </Badge>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black">
            <Shield className="h-16 w-16 text-app-yellow mb-4" />
            <h2 className="text-white text-xl font-bold mb-2">Start Your Live Stream</h2>
            <p className="text-gray-400 text-center mb-6 max-w-md">
              Connect with your audience in real-time. Your followers will be notified when you go live.
            </p>
            <Button 
              onClick={startBroadcast}
              className="bg-app-yellow text-black hover:bg-app-yellow/90"
              size="lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              Go Live
            </Button>
          </div>
        )}
      </Card>
      
      {isStreaming && (
        <div className="p-4 bg-black">
          <Button 
            onClick={endBroadcast}
            variant="destructive"
            className="w-full"
          >
            End Stream
          </Button>
        </div>
      )}
    </div>
  );
};

export default StreamerBroadcast;
