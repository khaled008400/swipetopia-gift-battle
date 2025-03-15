
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { VirtualGift } from "@/types/gift.types";

interface GiftSelectorProps {
  onClose: () => void;
  videoId: string;
  creatorId: string;
}

const GiftSelector = ({ onClose, videoId, creatorId }: GiftSelectorProps) => {
  const [gifts, setGifts] = useState<VirtualGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('virtual_gifts')
        .select('*')
        .eq('available', true);
      
      if (error) throw error;
      
      setGifts(data || []);
    } catch (error) {
      console.error("Error fetching gifts:", error);
      toast({
        title: "Error",
        description: "Failed to load gifts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendGift = async (gift: VirtualGift) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to send gifts",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      
      // Check user's coin balance
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      if (userData && userData.coins < gift.price) {
        toast({
          title: "Insufficient Coins",
          description: "You don't have enough coins to send this gift",
          variant: "destructive",
        });
        return;
      }
      
      // Record the gift transaction
      const { error: giftError } = await supabase
        .from('gift_transactions')
        .insert([{
          sender_id: user.id,
          receiver_id: creatorId,
          video_id: videoId,
          gift_id: gift.id,
          amount: gift.value
        }]);
      
      if (giftError) throw giftError;
      
      // Deduct coins from sender
      const { error: updateError } = await supabase
        .rpc('deduct_coins', { user_id: user.id, coin_amount: gift.price });
      
      if (updateError) throw updateError;
      
      // Add coins to creator
      const { error: creatorError } = await supabase
        .rpc('add_coins', { user_id: creatorId, coin_amount: gift.value });
      
      if (creatorError) throw creatorError;
      
      toast({
        title: "Gift Sent!",
        description: `You sent a ${gift.name} to the creator`,
      });
      
      onClose();
    } catch (error) {
      console.error("Error sending gift:", error);
      toast({
        title: "Error",
        description: "Failed to send gift. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="absolute bottom-full right-0 mb-4 p-4 bg-black/80 backdrop-blur-md rounded-lg w-64 border border-app-yellow/20 z-50 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold">Send a Gift</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 p-0 text-white">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-4">
          <p className="text-white text-sm">Loading gifts...</p>
        </div>
      ) : gifts.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto">
          {gifts.map((gift) => (
            <Button
              key={gift.id}
              variant="ghost"
              className="flex flex-col items-center p-2 hover:bg-app-yellow/20 rounded-lg"
              onClick={() => sendGift(gift)}
              disabled={sending}
            >
              <div className="text-2xl mb-1">{gift.icon}</div>
              <span className="text-white text-xs">{gift.name}</span>
              <span className="text-app-yellow text-xs">{gift.price} coins</span>
            </Button>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-white text-sm">No gifts available</p>
        </div>
      )}
    </div>
  );
};

export default GiftSelector;
