
import { useState } from "react";
import { X, Heart, Star, Diamond, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface GiftSelectorProps {
  onClose: () => void;
  videoId: string;
  creatorId: string;
}

const GIFTS = [
  { id: "1", name: "Heart", icon: <Heart className="h-6 w-6 text-red-500" />, value: 10, color: "bg-red-100" },
  { id: "2", name: "Star", icon: <Star className="h-6 w-6 text-yellow-500" />, value: 50, color: "bg-yellow-100" },
  { id: "3", name: "Diamond", icon: <Diamond className="h-6 w-6 text-blue-500" />, value: 100, color: "bg-blue-100" },
  { id: "4", name: "Crown", icon: <Gift className="h-6 w-6 text-purple-500" />, value: 500, color: "bg-purple-100" },
];

const GiftSelector = ({ onClose, videoId, creatorId }: GiftSelectorProps) => {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user, requiresAuth } = useAuth();

  const handleSelectGift = (giftId: string) => {
    setSelectedGift(giftId);
  };

  const handleSendGift = async () => {
    if (!selectedGift) {
      toast({
        title: "No gift selected",
        description: "Please select a gift to send",
        variant: "destructive",
      });
      return;
    }

    requiresAuth(async () => {
      try {
        setIsSending(true);

        const selectedGiftObj = GIFTS.find((gift) => gift.id === selectedGift);
        if (!selectedGiftObj) {
          throw new Error("Gift not found");
        }

        const giftValue = selectedGiftObj.value;

        // Check if user has enough coins
        if ((user?.coins || 0) < giftValue) {
          toast({
            title: "Not enough coins",
            description: "You don't have enough coins to send this gift",
            variant: "destructive",
          });
          return;
        }

        // 1. First deduct coins from sender using direct update instead of RPC
        const { error: deductError } = await supabase
          .from('profiles')
          .update({ coins: (user?.coins || 0) - giftValue })
          .eq('id', user!.id);

        if (deductError) {
          throw deductError;
        }

        // 2. Get creator's ID from username
        const { data: creatorData, error: creatorError } = await supabase
          .from('profiles')
          .select('id, coins')
          .eq('username', creatorId)
          .single();

        if (creatorError || !creatorData) {
          throw new Error("Creator not found");
        }

        // 3. Add coins to creator using direct update instead of RPC
        const { error: addError } = await supabase
          .from('profiles')
          .update({ coins: (creatorData.coins || 0) + giftValue })
          .eq('id', creatorData.id);

        if (addError) {
          throw addError;
        }

        // 4. Record transaction - fixed the type issue with gift_id being a string
        const { error: transactionError } = await supabase
          .from('gift_transactions')
          .insert({
            sender_id: user!.id,
            receiver_id: creatorData.id,
            video_id: videoId,
            gift_id: selectedGift,
            amount: giftValue
          });

        if (transactionError) {
          throw transactionError;
        }

        toast({
          title: "Gift sent!",
          description: `You sent a ${selectedGiftObj.name} to ${creatorId}`,
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
        setIsSending(false);
      }
    });
  };

  return (
    <div className="absolute bottom-16 right-0 w-64 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-sm font-semibold">Send a Gift</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        {GIFTS.map((gift) => (
          <div
            key={gift.id}
            className={`flex flex-col items-center p-2 rounded-md cursor-pointer transition-all ${
              selectedGift === gift.id
                ? "ring-2 ring-app-yellow"
                : "hover:bg-gray-800"
            } ${gift.color}`}
            onClick={() => handleSelectGift(gift.id)}
          >
            <div className="mb-1">{gift.icon}</div>
            <span className="text-xs font-medium">{gift.name}</span>
            <span className="text-xs">{gift.value} coins</span>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Your balance: {user?.coins || 0} coins</span>
        <Button
          size="sm"
          className="bg-app-yellow text-black hover:bg-app-yellow/80 h-8"
          onClick={handleSendGift}
          disabled={isSending || selectedGift === null}
        >
          {isSending ? "Sending..." : "Send Gift"}
        </Button>
      </div>
    </div>
  );
};

export default GiftSelector;
