
import { useState } from "react";
import { Gift, Sparkles, ChevronUp, ChevronDown, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

// Mock data - would come from API in production
const mockGiftTiers = [
  {
    id: "1",
    name: "Bronze Support",
    description: "Show your appreciation with a small gift",
    price: 100, // coins
    perks: ["Special shoutout in next stream", "Bronze supporter badge"]
  },
  {
    id: "2",
    name: "Silver Support",
    description: "Support your favorite streamer and get noticed",
    price: 500, // coins
    perks: ["Personal thank you message", "Silver supporter badge", "Access to subscriber-only streams"]
  },
  {
    id: "3",
    name: "Gold Support",
    description: "Become a VIP supporter with exclusive benefits",
    price: 1000, // coins
    perks: ["VIP entry to future events", "Gold supporter badge", "Monthly one-on-one chat", "Early access to new products"]
  }
];

interface SupportSectionProps {
  streamerId?: string;
}

const SupportSection = ({ streamerId }: SupportSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expandedTier, setExpandedTier] = useState<string | null>("1");
  
  const handleSupport = (tierId: string, price: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to support this streamer",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to process the gift
    toast({
      title: "Thank You!",
      description: `You've successfully supported this streamer with ${price} coins!`,
      variant: "default",
    });
  };
  
  const toggleTier = (tierId: string) => {
    setExpandedTier(expandedTier === tierId ? null : tierId);
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-app-gray-dark rounded-md p-4">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-5 w-5 text-app-yellow" />
          <h3 className="text-lg font-medium">Support Tiers</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Show your support and unlock exclusive perks by sending gifts to this streamer.
        </p>
        
        <div className="space-y-4">
          {mockGiftTiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`border ${
                expandedTier === tier.id ? "border-app-yellow" : "border-app-gray-light"
              } bg-app-gray-darker`}
            >
              <CardContent className="p-0">
                <div 
                  className="p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleTier(tier.id)}
                >
                  <div>
                    <div className="font-medium">{tier.name}</div>
                    <div className="text-sm text-muted-foreground">{tier.description}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="mr-3 text-right">
                      <div className="font-medium text-app-yellow">{tier.price}</div>
                      <div className="text-xs text-muted-foreground">coins</div>
                    </div>
                    {expandedTier === tier.id ? 
                      <ChevronUp className="h-5 w-5" /> : 
                      <ChevronDown className="h-5 w-5" />
                    }
                  </div>
                </div>
                
                {expandedTier === tier.id && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="bg-app-gray-dark p-3 rounded-md mb-3">
                      <div className="text-sm font-medium mb-2">Perks:</div>
                      <ul className="text-sm space-y-1">
                        {tier.perks.map((perk, index) => (
                          <li key={index} className="flex items-start">
                            <Sparkles className="h-4 w-4 text-app-yellow mr-2 mt-0.5 flex-shrink-0" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full bg-app-yellow text-app-black"
                      onClick={() => handleSupport(tier.id, tier.price)}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Support with {tier.price} Coins
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
