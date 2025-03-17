
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LiveChatProps {
  streamId: string;
}

interface ChatMessage {
  id: string;
  message: string;
  created_at: string;
  sender: {
    username: string;
    avatar_url: string;
  };
}

const LiveChat: React.FC<LiveChatProps> = ({ streamId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        // First, get the messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('chat_messages')
          .select(`
            id,
            message,
            created_at,
            sender_id
          `)
          .eq('stream_id', streamId)
          .order('created_at', { ascending: true })
          .limit(50);
        
        if (messagesError) throw messagesError;
        
        // Then, get the profiles for these messages
        const senderIds = messagesData.map(msg => msg.sender_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', senderIds);
          
        if (profilesError) throw profilesError;
        
        // Map profiles to a dictionary for quick lookup
        const profilesMap = profilesData.reduce((acc: Record<string, any>, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
        
        // Combine messages with profiles
        const formattedMessages = messagesData.map(msg => ({
          id: msg.id,
          message: msg.message,
          created_at: msg.created_at,
          sender: {
            username: profilesMap[msg.sender_id]?.username || 'Unknown User',
            avatar_url: profilesMap[msg.sender_id]?.avatar_url || ''
          }
        }));
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('chat-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `stream_id=eq.${streamId}`
      }, async (payload) => {
        // Fetch the user info for the new message
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', payload.new.sender_id)
          .single();
        
        if (userError) {
          console.error('Error fetching sender data:', userError);
          return;
        }
        
        const newMessage: ChatMessage = {
          id: payload.new.id,
          message: payload.new.message,
          created_at: payload.new.created_at,
          sender: {
            username: userData?.username || 'Unknown User',
            avatar_url: userData?.avatar_url || ''
          }
        };
        
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [streamId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          stream_id: streamId,
          sender_id: user.id,
          message: message.trim()
        });
      
      if (error) throw error;
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-3 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col space-y-3">
            <div className="flex items-start space-x-2 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
            <div className="flex items-start space-x-2 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div className="text-gray-500">
              <p>No chat messages yet</p>
              <p className="text-sm">Be the first to say hello!</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="mb-3">
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.sender.avatar_url} />
                  <AvatarFallback>{msg.sender.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{msg.sender.username}</p>
                  <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded-md">{msg.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!user}
        />
        <Button type="submit" size="sm" disabled={!user || !message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default LiveChat;
