
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface ChatMessage {
  id: string;
  message: string;
  created_at: string;
  sender: {
    username: string;
    avatar_url: string;
  };
}

export function useStreamChat(streamId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
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
  
  const sendMessage = async (message: string) => {
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
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };
  
  return {
    messages,
    loading,
    sendMessage
  };
}
