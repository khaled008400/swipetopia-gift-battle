
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export interface LiveChatProps {
  streamId: string;
}

interface ChatMessage {
  id: string;
  message: string;
  created_at: string;
  sender_id: string;
  sender_username?: string;
  sender_avatar?: string;
}

const LiveChat: React.FC<LiveChatProps> = ({ streamId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            *,
            profiles:sender_id (username, avatar_url)
          `)
          .eq('stream_id', streamId)
          .order('created_at', { ascending: true })
          .limit(50);
        
        if (error) throw error;
        
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          message: msg.message,
          created_at: msg.created_at,
          sender_id: msg.sender_id,
          sender_username: msg.profiles?.username || 'Anonymous',
          sender_avatar: msg.profiles?.avatar_url
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };
    
    fetchMessages();
  }, [streamId]);
  
  // Subscribe to new messages
  useEffect(() => {
    const chatSubscription = supabase
      .channel(`chat-${streamId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages',
        filter: `stream_id=eq.${streamId}`
      }, async (payload) => {
        try {
          // Get the sender profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();
          
          const newMessage: ChatMessage = {
            id: payload.new.id,
            message: payload.new.message,
            created_at: payload.new.created_at,
            sender_id: payload.new.sender_id,
            sender_username: profile?.username || 'Anonymous',
            sender_avatar: profile?.avatar_url
          };
          
          setMessages(prev => [...prev, newMessage]);
        } catch (error) {
          console.error('Error fetching message sender:', error);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(chatSubscription);
    };
  }, [streamId]);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !user) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          stream_id: streamId,
          sender_id: user.id,
          message: messageText.trim()
        });
      
      if (error) throw error;
      
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-background border rounded-md">
      <div className="p-3 border-b">
        <h3 className="font-semibold">Live Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">No messages yet</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="flex items-start space-x-2">
              <Avatar className="h-8 w-8">
                {msg.sender_avatar && <img src={msg.sender_avatar} alt={msg.sender_username} />}
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{msg.sender_username}</p>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="p-3 border-t flex">
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          disabled={!user || loading}
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!user || !messageText.trim() || loading}
          className="ml-2"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default LiveChat;
