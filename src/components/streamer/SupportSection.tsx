
import { Gift, Coins, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTopSupporters, TopSupporter } from "@/hooks/useStreamerData";
import { Skeleton } from "@/components/ui/skeleton";

interface SupportSectionProps {
  streamerId?: string;
}

const SupportSection = ({ streamerId }: SupportSectionProps) => {
  const { topSupporters, isLoading, error } = useTopSupporters(streamerId || '');
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Donation Options */}
      <Card className="bg-app-gray-dark border-app-gray-light">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Support Options</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-app-gray-light rounded-lg hover:border-app-yellow transition-colors">
              <div className="flex items-center">
                <div className="bg-purple-900/20 p-2 rounded-lg mr-3">
                  <Gift className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="font-medium">Send Virtual Gifts</div>
                  <div className="text-sm text-muted-foreground">Gift special items during streams</div>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Gift
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-app-gray-light rounded-lg hover:border-app-yellow transition-colors">
              <div className="flex items-center">
                <div className="bg-yellow-900/20 p-2 rounded-lg mr-3">
                  <Coins className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="font-medium">Send Coins</div>
                  <div className="text-sm text-muted-foreground">Direct coin donations</div>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Donate
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-app-gray-light rounded-lg hover:border-app-yellow transition-colors">
              <div className="flex items-center">
                <div className="bg-red-900/20 p-2 rounded-lg mr-3">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="font-medium">Subscribe</div>
                  <div className="text-sm text-muted-foreground">Monthly support with benefits</div>
                </div>
              </div>
              <Button className="bg-app-yellow text-app-black hover:bg-app-yellow/90" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Top Supporters */}
      <Card className="bg-app-gray-dark border-app-gray-light">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Top Supporters</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-5 w-14" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">Failed to load top supporters</div>
          ) : topSupporters.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">No supporters yet</div>
          ) : (
            <div className="space-y-4">
              {topSupporters.map((supporter, index) => (
                <div key={supporter.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-app-gray-light/20 transition-colors">
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <Avatar>
                        <AvatarImage src={supporter.supporter_avatar || ''} />
                        <AvatarFallback>{supporter.supporter_username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 
                            ? 'bg-yellow-500 text-black' 
                            : index === 1 
                              ? 'bg-gray-300 text-black' 
                              : 'bg-amber-700 text-white'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{supporter.supporter_username}</div>
                      <div className="text-xs text-muted-foreground">
                        {supporter.gift_amount > 10000 
                          ? 'Ultimate Fan' 
                          : supporter.gift_amount > 5000 
                            ? 'Super Fan' 
                            : 'Supporter'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-app-yellow font-semibold">
                    <Coins className="h-4 w-4 mr-1" />
                    {supporter.gift_amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportSection;
