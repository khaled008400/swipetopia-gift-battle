
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';

interface GiftEvent {
  id: string;
  sender_id: string;
  sender_username?: string;
  receiver_id: string;
  gift_type: string;
  coins_amount: number;
  created_at: string;
  stream_id?: string;
  battle_id?: string;
}

interface BattleRequest {
  id: string;
  stream_a_id: string;
  stream_b_id: string;
  status: 'pending' | 'active' | 'completed';
  started_at: string;
}

export function useLiveStreamRealtime(streamId?: string) {
  const [incomingGifts, setIncomingGifts] = useState<GiftEvent[]>([]);
  const [battleRequests, setBattleRequests] = useState<BattleRequest[]>([]);
  const [activeBattle, setActiveBattle] = useState<string | null>(null);
  const [streamScore, setStreamScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    // Channel for gift notifications
    const giftsChannel = supabase.channel('gifts');
    
    // Channel for battle requests and updates
    const battlesChannel = supabase.channel('battles');
    
    // Listen for new gifts
    giftsChannel.on(
      'postgres_changes' as any,
      {
        event: 'INSERT',
        schema: 'public',
        table: 'stream_gifts',
        filter: streamId ? `stream_id=eq.${streamId}` : undefined
      },
      (payload: any) => {
        const gift = payload.new as GiftEvent;
        
        // If this is for the current user's stream, show notification and add to list
        if (gift.receiver_id === user.id || (streamId && gift.stream_id === streamId)) {
          setIncomingGifts(prev => [gift, ...prev.slice(0, 19)]); // Keep last 20 gifts
          
          // Update score if part of a battle
          if (gift.battle_id && gift.battle_id === activeBattle) {
            if (gift.receiver_id === user.id) {
              setStreamScore(prev => prev + gift.coins_amount);
            } else {
              setOpponentScore(prev => prev + gift.coins_amount);
            }
          }
          
          toast({
            title: "New Gift Received!",
            description: `You received a ${gift.gift_type} gift worth ${gift.coins_amount} coins!`,
            duration: 5000,
          });
        }
      }
    );
    
    // Listen for battle requests
    battlesChannel.on(
      'postgres_changes' as any,
      {
        event: 'INSERT',
        schema: 'public',
        table: 'battles',
        filter: streamId ? `stream_b_id=eq.${streamId}` : undefined
      },
      (payload: any) => {
        const battle = payload.new as BattleRequest;
        
        // Only add to battle requests if this is for the current user's stream
        // and status is pending
        if (battle.status === 'pending') {
          setBattleRequests(prev => [battle, ...prev]);
          
          toast({
            title: "New Battle Request!",
            description: "Another streamer has challenged you to a battle!",
            duration: 10000,
          });
        }
      }
    );
    
    // Listen for battle status changes
    battlesChannel.on(
      'postgres_changes' as any,
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'battles'
      },
      (payload: any) => {
        const battle = payload.new as BattleRequest;
        
        // Check if this is a battle related to the current user/stream
        if (streamId && (battle.stream_a_id === streamId || battle.stream_b_id === streamId)) {
          // If battle became active
          if (battle.status === 'active' && !activeBattle) {
            setActiveBattle(battle.id);
            
            toast({
              title: "Battle Started!",
              description: "The PK battle has been activated!",
              duration: 5000,
            });
          }
          
          // If battle ended
          if (battle.status === 'completed' && activeBattle === battle.id) {
            setActiveBattle(null);
            
            toast({
              title: "Battle Ended",
              description: "The PK battle has concluded.",
              duration: 5000,
            });
          }
        }
      }
    );
    
    // Subscribe to the channels
    giftsChannel.subscribe();
    battlesChannel.subscribe();
    
    // Cleanup on unmount
    return () => {
      supabase.removeChannel(giftsChannel);
      supabase.removeChannel(battlesChannel);
    };
  }, [user, streamId, activeBattle, toast]);
  
  return {
    incomingGifts,
    battleRequests,
    activeBattle,
    streamScore,
    opponentScore,
    // Reset current scores
    resetScores: () => {
      setStreamScore(0);
      setOpponentScore(0);
    }
  };
}
