
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Gift, Heart, Send } from "lucide-react";
import { useViewerPresence } from "@/hooks/useViewerPresence";

interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string | null;
  text: string;
  type: 'text' | 'gift' | 'join' | 'like';
  timestamp: string;
}

interface LiveChatProps {
  streamerId: string;
}

const LiveChat = ({ streamerId }: LiveChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { viewers, viewerCount } = useViewerPresence(streamerId);

  // Automatically scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const chatChannel = supabase.channel(`chat:${streamerId}`);

    // Listen for chat messages
    chatChannel
      .on('broadcast', { event: 'chat-message' }, (payload) => {
        setMessages((prev) => [...prev, payload.payload as Message]);
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        
        // Add a system message when connected
        if (status === 'SUBSCRIBED') {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              userId: 'system',
              username: 'System',
              avatar: null,
              text: 'Welcome to the chat!',
              type: 'text',
              timestamp: new Date().toISOString()
            }
          ]);
        }
      });

    // Clean up
    return () => {
      supabase.removeChannel(chatChannel);
    };
  }, [streamerId]);

  // When a new viewer joins, add a message
  useEffect(() => {
    if (viewers.length > 0) {
      const lastViewer = viewers[viewers.length - 1];
      // Only add new join messages
      if (!messages.some(m => m.type === 'join' && m.userId === lastViewer.id)) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            userId: lastViewer.id,
            username: lastViewer.username,
            avatar: lastViewer.avatar,
            text: 'joined the stream',
            type: 'join',
            timestamp: new Date().toISOString()
          }
        ]);
      }
    }
  }, [viewers, messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !isConnected) return;

    try {
      // Get user profile info
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      const message: Message = {
        id: crypto.randomUUID(),
        userId: user.id,
        username: profileData?.username || 'Anonymous',
        avatar: profileData?.avatar_url,
        text: newMessage,
        type: 'text',
        timestamp: new Date().toISOString()
      };

      // Broadcast the message to all clients
      await supabase.channel(`chat:${streamerId}`).send({
        type: 'broadcast',
        event: 'chat-message',
        payload: message
      });

      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const simulateGift = async () => {
    if (!user || !isConnected) return;

    try {
      // Get user profile info
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      const giftMessage: Message = {
        id: crypto.randomUUID(),
        userId: user.id,
        username: profileData?.username || 'Anonymous',
        avatar: profileData?.avatar_url,
        text: 'sent a gift!',
        type: 'gift',
        timestamp: new Date().toISOString()
      };

      // Broadcast the gift message
      await supabase.channel(`chat:${streamerId}`).send({
        type: 'broadcast',
        event: 'chat-message',
        payload: giftMessage
      });
    } catch (error) {
      console.error("Error sending gift:", error);
    }
  };

  const simulateLike = async () => {
    if (!user || !isConnected) return;

    try {
      // Get user profile info
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      const likeMessage: Message = {
        id: crypto.randomUUID(),
        userId: user.id,
        username: profileData?.username || 'Anonymous',
        avatar: profileData?.avatar_url,
        text: 'liked the stream!',
        type: 'like',
        timestamp: new Date().toISOString()
      };

      // Broadcast the like message
      await supabase.channel(`chat:${streamerId}`).send({
        type: 'broadcast',
        event: 'chat-message',
        payload: likeMessage
      });
    } catch (error) {
      console.error("Error sending like:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-app-gray-dark border border-app-gray-light rounded-lg overflow-hidden">
      <div className="p-3 border-b border-app-gray-light flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-app-yellow" />
          <span className="font-medium">Live Chat</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {viewerCount} viewer{viewerCount !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={message.avatar || ''} />
              <AvatarFallback>{message.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium text-sm mr-1">{message.username}</span>
                {message.type === 'gift' && (
                  <Gift className="h-3 w-3 text-purple-400" />
                )}
                {message.type === 'join' && (
                  <span className="text-green-400 text-xs">•</span>
                )}
                {message.type === 'like' && (
                  <Heart className="h-3 w-3 text-red-400" />
                )}
              </div>
              <p className={`text-sm ${
                message.type === 'join' 
                  ? 'text-green-400' 
                  : message.type === 'gift' 
                    ? 'text-purple-400' 
                    : message.type === 'like'
                      ? 'text-red-400'
                      : 'text-gray-200'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-app-gray-light">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 text-purple-400" 
            onClick={simulateGift}
          >
            <Gift className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 text-red-400" 
            onClick={simulateLike}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Input 
            className="flex-1 h-8 bg-app-gray-light border-app-gray-light"
            placeholder="Type a message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            size="icon" 
            className="h-8 w-8 bg-app-yellow text-app-black hover:bg-app-yellow/90"
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
