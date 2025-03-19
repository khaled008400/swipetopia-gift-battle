
import React from 'react';
import { useState, useEffect } from 'react';
import { Gift, X, Heart, Star, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGifts } from '@/hooks/useGifts';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface GiftSelectorProps {
  videoId?: string;
  creatorId?: string;
}

const GiftSelector: React.FC<GiftSelectorProps> = ({ videoId, creatorId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const { gifts, isLoading, error } = useGifts();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendGift = (giftId: string, price: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to send gifts",
        variant: "destructive",
      });
      return;
    }
    
    if (user.coins < price) {
      toast({
        title: "Insufficient Coins",
        description: `You need ${price} coins to send this gift. You have ${user.coins} coins.`,
        variant: "destructive",
      });
      return;
    }
    
    // Here you would call your API to send the gift
    console.log(`Sending gift ${giftId} for ${price} coins to creator ${creatorId} on video ${videoId}`);
    
    toast({
      title: "Gift Sent!",
      description: "Your gift has been sent successfully",
    });
    
    // Close the selector after sending
    setIsOpen(false);
  };
  
  // Filter gifts by category
  const filteredGifts = gifts?.filter(gift => {
    if (selectedCategory === 'popular') return gift.is_premium || gift.is_popular; // Using is_premium as fallback
    return gift.category === selectedCategory;
  });
  
  if (!isOpen) {
    return (
      <Button 
        onClick={toggleOpen}
        variant="outline" 
        size="sm"
        className="bg-pink-500/20 hover:bg-pink-500/30 border-pink-500/50 text-pink-500"
      >
        <Gift className="h-4 w-4 mr-2" />
        Send Gift
      </Button>
    );
  }
  
  return (
    <Card className="absolute bottom-16 right-0 w-72 z-50 border-pink-500/50 bg-black/90 backdrop-blur-sm">
      <div className="flex justify-between items-center p-2 border-b border-pink-500/20">
        <h3 className="text-sm font-medium flex items-center">
          <Gift className="h-4 w-4 mr-2 text-pink-500" />
          Send a Gift
        </h3>
        <Button variant="ghost" size="sm" onClick={toggleOpen} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="popular" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-4 bg-transparent">
          <TabsTrigger value="popular" className="text-xs">
            <Star className="h-3 w-3 mr-1" /> Popular
          </TabsTrigger>
          <TabsTrigger value="basic" className="text-xs">
            <Heart className="h-3 w-3 mr-1" /> Basic
          </TabsTrigger>
          <TabsTrigger value="premium" className="text-xs">
            <Award className="h-3 w-3 mr-1" /> Premium
          </TabsTrigger>
          <TabsTrigger value="exclusive" className="text-xs">
            <Zap className="h-3 w-3 mr-1" /> Exclusive
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="p-2">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-center text-sm text-red-500 py-4">
              Failed to load gifts. Please try again.
            </p>
          ) : (
            <ScrollArea className="h-48">
              <div className="grid grid-cols-3 gap-2 p-1">
                {filteredGifts?.map((gift) => (
                  <div 
                    key={gift.id}
                    className="flex flex-col items-center p-1 border border-transparent hover:border-pink-500/50 rounded-md cursor-pointer transition-all"
                    onClick={() => handleSendGift(gift.id, gift.price)}
                  >
                    <img 
                      src={gift.image_url} 
                      alt={gift.name}
                      className="w-10 h-10 object-contain"
                    />
                    <span className="text-xs mt-1 truncate w-full text-center">{gift.name}</span>
                    <span className="text-xs font-medium text-yellow-500">{gift.price} coins</span>
                  </div>
                ))}
                
                {filteredGifts?.length === 0 && (
                  <p className="text-center text-xs text-gray-400 col-span-3 py-8">
                    No gifts found in this category
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
          
          {user && (
            <div className="mt-2 pt-2 border-t border-pink-500/20 flex justify-between items-center">
              <span className="text-xs text-gray-400">Your balance:</span>
              <span className="text-sm font-medium text-yellow-500">{user.coins} coins</span>
            </div>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default GiftSelector;
