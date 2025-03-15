
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

export interface GiftAnimationProps {
  streamId: string;
}

interface Gift {
  id: string;
  sender_username: string;
  gift_type: string;
  coins_amount: number;
}

const GiftAnimation: React.FC<GiftAnimationProps> = ({ streamId }) => {
  const [currentGift, setCurrentGift] = useState<Gift | null>(null);
  const [queue, setQueue] = useState<Gift[]>([]);
  
  // Subscribe to gift events
  useEffect(() => {
    const giftSubscription = supabase
      .channel(`stream-gifts-${streamId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'stream_gifts',
        filter: `stream_id=eq.${streamId}`
      }, async (payload) => {
        try {
          // Get the sender username
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', payload.new.sender_id)
            .single();
          
          const newGift: Gift = {
            id: payload.new.id,
            sender_username: profile?.username || 'Anonymous',
            gift_type: payload.new.gift_type,
            coins_amount: payload.new.coins_amount
          };
          
          // Add to queue
          setQueue(prev => [...prev, newGift]);
        } catch (error) {
          console.error('Error fetching gift sender:', error);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(giftSubscription);
    };
  }, [streamId]);
  
  // Process the queue
  useEffect(() => {
    if (queue.length > 0 && !currentGift) {
      // Take the first gift from the queue
      const nextGift = queue[0];
      setCurrentGift(nextGift);
      setQueue(prev => prev.slice(1));
      
      // Clear after animation duration
      const timer = setTimeout(() => {
        setCurrentGift(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [queue, currentGift]);
  
  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden z-10">
      <AnimatePresence>
        {currentGift && (
          <motion.div
            key={currentGift.id}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-3 m-4 text-white flex items-center"
          >
            <div className="mr-3">
              <span className="text-xl">🎁</span>
            </div>
            <div>
              <p className="font-bold">{currentGift.sender_username}</p>
              <p>Sent a {currentGift.gift_type} ({currentGift.coins_amount} coins)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftAnimation;
