
import { Trophy, ThumbsDown, Users, User, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock data - would come from API in production
const mockTopSupporters = [
  { id: "1", username: "fashionista", avatar: "https://i.pravatar.cc/150?u=fashionista", giftAmount: 1250 },
  { id: "2", username: "techguy", avatar: "https://i.pravatar.cc/150?u=techguy", giftAmount: 850 },
  { id: "3", username: "travelbug", avatar: "https://i.pravatar.cc/150?u=travelbug", giftAmount: 650 },
  { id: "4", username: "foodiestar", avatar: "https://i.pravatar.cc/150?u=foodiestar", giftAmount: 420 },
  { id: "5", username: "gamerlive", avatar: "https://i.pravatar.cc/150?u=gamerlive", giftAmount: 350 },
];

const mockRecentBattles = [
  { 
    id: "1", 
    opponent: { username: "beautyguru", avatar: "https://i.pravatar.cc/150?u=beautyguru" },
    date: "2023-08-16T20:00:00Z",
    result: "win",
    viewCount: 2135,
    votesReceived: 1243,
    votesOpponent: 892
  },
  { 
    id: "2", 
    opponent: { username: "fitnesscoach", avatar: "https://i.pravatar.cc/150?u=fitnesscoach" },
    date: "2023-08-12T19:30:00Z",
    result: "loss",
    viewCount: 1876,
    votesReceived: 768,
    votesOpponent: 1108
  },
  { 
    id: "3", 
    opponent: { username: "cookinglover", avatar: "https://i.pravatar.cc/150?u=cookinglover" },
    date: "2023-08-05T18:00:00Z",
    result: "win",
    viewCount: 1543,
    votesReceived: 835,
    votesOpponent: 708
  },
];

const BattleStats = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Battle Statistics</h2>
        <p className="text-sm text-muted-foreground">
          Track your PK battle performance and your most supportive fans
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Battles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-2xl font-bold">18</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Wins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Trophy className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-2xl font-bold">12</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Losses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ThumbsDown className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-2xl font-bold">6</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">67%</span>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 bg-app-gray-dark rounded-md overflow-hidden">
          <div className="p-4 border-b border-app-gray-light">
            <h3 className="font-medium">Recent Battles</h3>
          </div>
          
          <div className="divide-y divide-app-gray-light">
            {mockRecentBattles.map((battle) => (
              <div key={battle.id} className="p-4 hover:bg-app-gray-darker transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={battle.opponent.avatar} />
                      <AvatarFallback>{battle.opponent.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">vs @{battle.opponent.username}</span>
                        <Badge className={battle.result === "win" ? "bg-green-600 ml-2" : "bg-red-600 ml-2"}>
                          {battle.result === "win" ? "WIN" : "LOSS"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(battle.date).toLocaleDateString()} • {battle.viewCount} viewers
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm">
                      <span className="text-green-400">{battle.votesReceived}</span>
                      <span className="mx-1">vs</span>
                      <span className="text-red-400">{battle.votesOpponent}</span>
                    </div>
                    <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2 bg-app-gray-dark rounded-md overflow-hidden">
          <div className="p-4 border-b border-app-gray-light">
            <h3 className="font-medium flex items-center">
              <Star className="h-4 w-4 text-app-yellow mr-2" />
              Top Supporters
            </h3>
          </div>
          
          <div className="divide-y divide-app-gray-light">
            {mockTopSupporters.map((supporter, index) => (
              <div key={supporter.id} className="p-4 hover:bg-app-gray-darker transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-6 text-center mr-2 text-muted-foreground">
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={supporter.avatar} />
                      <AvatarFallback>{supporter.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">@{supporter.username}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-yellow-400 font-semibold text-sm mr-1">⭐</span>
                    <span>{supporter.giftAmount}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-3 text-center">
              <Button variant="link" size="sm">
                View All Supporters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleStats;
