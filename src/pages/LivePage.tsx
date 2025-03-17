
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { StreamService } from '@/services/streaming';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Users, ShoppingBag, Gift, MessageCircle, Share2, Flag } from 'lucide-react';
import LiveStreamIndicator from '@/components/live/LiveStreamIndicator';
import AgoraVideoStream from '@/components/live/AgoraVideoStream';
import LiveChat from '@/components/streamer/LiveChat';
import StreamProducts from '@/components/live/StreamProducts';
import GiftAnimation from '@/components/live/GiftAnimation';

const LivePage: React.FC = () => {
  const { streamId } = useParams<{ streamId: string }>();
  const [showChat, setShowChat] = useState(true);
  const [showProducts, setShowProducts] = useState(false);
  
  const { data: stream, isLoading, error } = useQuery({
    queryKey: ['stream', streamId],
    queryFn: () => StreamService.getStream(streamId || ''),
    enabled: !!streamId,
  });
  
  // Since we don't have implementations for joinStream and leaveStream,
  // we'll comment these out for now
  /*
  useEffect(() => {
    // Join stream presence
    if (stream?.id) {
      StreamService.joinStream(stream.id);
      
      // Clean up on unmount
      return () => {
        StreamService.leaveStream(stream.id);
      };
    }
  }, [stream?.id]);
  */
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading stream...</p>
        </div>
      </div>
    );
  }
  
  if (error || !stream) {
    return (
      <div className="container mx-auto p-4 text-center min-h-[70vh] flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Stream Not Found</h2>
        <p className="mb-8">The live stream you're looking for may have ended or doesn't exist.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }
  
  if (stream.status !== 'live') {
    return (
      <div className="container mx-auto p-4 text-center min-h-[70vh] flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Stream Has Ended</h2>
        <p className="mb-8">This stream is no longer live.</p>
        <Button onClick={() => window.history.back()}>Browse Other Streams</Button>
      </div>
    );
  }
  
  const toggleChat = () => setShowChat(!showChat);
  const toggleProducts = () => setShowProducts(!showProducts);
  
  return (
    <div className="container mx-auto p-2 md:p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="rounded-lg overflow-hidden bg-black relative">
            <LiveStreamIndicator viewerCount={stream.viewer_count} />
            <AgoraVideoStream streamId={stream.id} />
            <GiftAnimation streamId={stream.id} />
          </div>
          
          <div className="mt-4 flex justify-between items-start">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{stream.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={stream.profiles?.avatar_url || ''} />
                  <AvatarFallback>{stream.profiles?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{stream.profiles?.username}</span>
                <Badge variant="outline" className="ml-2 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {stream.viewer_count}
                </Badge>
              </div>
            </div>
            
            <div className="hidden md:flex gap-2">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <p className="text-gray-700">{stream.description}</p>
          
          <div className="md:hidden mt-6 grid grid-cols-4 gap-2">
            <Button variant="outline" className="flex flex-col items-center p-2 h-auto" onClick={toggleChat}>
              <MessageCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Chat</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-2 h-auto" onClick={toggleProducts}>
              <ShoppingBag className="h-5 w-5 mb-1" />
              <span className="text-xs">Products</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-2 h-auto">
              <Gift className="h-5 w-5 mb-1" />
              <span className="text-xs">Gift</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-2 h-auto">
              <Share2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
          
          <div className="md:hidden">
            {showProducts && <StreamProducts streamId={stream.id} className="mt-4" />}
          </div>
        </div>
        
        <div className={`${showChat ? 'block' : 'hidden'} md:block lg:col-span-1`}>
          <div className="rounded-lg border h-[60vh] md:h-[70vh] flex flex-col">
            <div className="p-3 border-b font-medium flex justify-between items-center">
              <span>Live Chat</span>
              <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleChat}>
                &times;
              </Button>
            </div>
            <LiveChat streamId={stream.id} />
          </div>
          
          <div className="hidden md:block mt-4">
            <StreamProducts streamId={stream.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePage;
