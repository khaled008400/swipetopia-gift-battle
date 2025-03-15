import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { GiftTransaction } from "@/types/gift.types";
import { Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentGiftsProps {
  videoId: string;
  limit?: number;
}

const RecentGifts = ({ videoId, limit = 5 }: RecentGiftsProps) => {
  const [gifts, setGifts] = useState<GiftTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        
        // Get initial gift transactions
        const { data: initialGiftsData, error } = await supabase
          .from('gift_transactions')
          .select(`
            id,
            sender_id,
            receiver_id,
            video_id,
            gift_id,
            amount,
            created_at
          `)
          .eq('video_id', videoId)
          .order('created_at', { ascending: false })
          .limit(limit);
          
        if (error) {
          console.error('Error fetching gifts:', error);
          return;
        }
          
        if (initialGiftsData && initialGiftsData.length > 0) {
          // Enrich transactions with sender and gift data
          const enrichedGifts = await Promise.all(initialGiftsData.map(async (transaction) => {
            // Get sender information
            const { data: senderData } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', transaction.sender_id)
              .single();
            
            // Get gift information
            const { data: giftData } = await supabase
              .from('virtual_gifts')
              .select('name, icon, color')
              .eq('id', transaction.gift_id)
              .single();
            
            return {
              ...transaction,
              sender: {
                username: senderData?.username || 'Anonymous',
                avatar_url: senderData?.avatar_url
              },
              gift: {
                name: giftData?.name || 'Gift',
                icon: giftData?.icon || '🎁',
                color: giftData?.color || '#6366f1'
              }
            } as GiftTransaction;
          }));
          
          setGifts(enrichedGifts);
        }
      } catch (error) {
        console.error('Error loading recent gifts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGifts();
    
    // Subscribe to real-time updates
    const channel = supabase.channel(`gifts:video:${videoId}`);
    
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'gift_transactions',
        filter: `video_id=eq.${videoId}`
      },
      async (payload) => {
        // When a new gift is received, fetch the complete gift details
        if (payload.new) {
          try {
            // Get sender information
            const { data: senderData } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', payload.new.sender_id)
              .single();
            
            // Get gift information
            const { data: giftData } = await supabase
              .from('virtual_gifts')
              .select('name, icon, color')
              .eq('id', payload.new.gift_id)
              .single();
            
            const newGift = {
              ...payload.new,
              sender: {
                username: senderData?.username || 'Anonymous',
                avatar_url: senderData?.avatar_url
              },
              gift: {
                name: giftData?.name || 'Gift',
                icon: giftData?.icon || '🎁',
                color: giftData?.color || '#6366f1'
              }
            } as GiftTransaction;
            
            // Add the new gift to the top of the list and keep only the last 'limit' gifts
            setGifts(prev => [newGift, ...prev.slice(0, limit - 1)]);
          } catch (error) {
            console.error('Error processing new gift:', error);
          }
        }
      }
    ).subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [videoId, limit]);
  
  if (loading) {
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Recent Gifts</h3>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (gifts.length === 0) {
    return (
      <div className="text-center py-3">
        <Gift className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">No gifts yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center">
        <Gift className="h-4 w-4 mr-1" /> Recent Gifts
      </h3>
      
      <div className="space-y-2">
        {gifts.map((gift) => (
          <div key={gift.id} className="flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ backgroundColor: gift.gift?.color || '#6366f1' }}
            >
              <span className="text-lg">{gift.gift?.icon || '🎁'}</span>
            </div>
            
            <div>
              <div className="text-sm font-medium">
                {gift.sender?.username || 'Anonymous'} 
                <span className="ml-1 text-gray-500">sent</span>
              </div>
              
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs py-0">
                  {gift.gift?.name || 'Gift'} x{gift.amount}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentGifts;
