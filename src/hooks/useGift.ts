
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { VirtualGift } from "@/types/gift.types";
import GiftService from "@/services/gift.service";

export interface GiftSendResult {
  success: boolean;
  message: string;
}

export function useGift(videoId?: string) {
  const [gifts, setGifts] = useState<VirtualGift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingGift, setSendingGift] = useState<boolean>(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  // Fetch available gifts on mount
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        const giftsData = await GiftService.getVirtualGifts();
        setGifts(giftsData);
      } catch (error) {
        console.error('Error fetching available gifts:', error);
        toast({
          title: "Error",
          description: "Could not load available gifts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGifts();
  }, [toast]);
  
  // Subscribe to real-time gift transactions
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Create channel for gift transaction notifications
    const channel = supabase.channel('gift-transactions');
    
    // Listen for new gift transactions
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'gift_transactions',
        filter: videoId ? `video_id=eq.${videoId}` : undefined
      },
      (payload) => {
        console.log('New gift transaction:', payload);
        
        // Here you can handle real-time gift transaction events
        // This could update UI, play animations, etc.
        if (payload.new && user && payload.new.receiver_id === user.id) {
          toast({
            title: "Gift Received!",
            description: "Someone sent you a gift!",
            duration: 3000,
          });
        }
      }
    ).subscribe();
    
    // Clean up on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user, videoId, toast]);
  
  // Function to send a gift
  const sendGift = async (receiverId: string, giftId: string, amount: number = 1): Promise<GiftSendResult> => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to send gifts",
        variant: "destructive",
      });
      return { success: false, message: "Authentication required" };
    }
    
    try {
      setSendingGift(true);
      
      await GiftService.sendGift(receiverId, giftId, videoId || '', amount);
      
      toast({
        title: "Gift Sent!",
        description: "Your gift was successfully sent",
      });
      
      return { success: true, message: "Gift sent successfully" };
    } catch (error: any) {
      console.error('Error sending gift:', error);
      
      toast({
        title: "Failed to Send Gift",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      
      return { success: false, message: error.message || "Failed to send gift" };
    } finally {
      setSendingGift(false);
    }
  };
  
  return {
    gifts,
    loading,
    sendingGift,
    sendGift
  };
}
