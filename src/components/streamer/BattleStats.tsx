
import { useState } from "react";
import { Trophy, ThumbsDown, Users, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useBattleHistory, useTopSupporters } from "@/hooks/useStreamerData";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

const BattleStats = () => {
  const { user } = useAuth();
  const { battleHistory, isLoading: isLoadingBattles } = useBattleHistory(user?.id || '');
  const { topSupporters, isLoading: isLoadingSupporters } = useTopSupporters(user?.id || '');
  
  // Calculate stats
  const totalBattles = battleHistory.length;
  const wins = battleHistory.filter(battle => battle.result === 'win').length;
  const losses = totalBattles - wins;
  const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 0;

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
              <span className="text-2xl font-bold">{totalBattles}</span>
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
              <span className="text-2xl font-bold">{wins}</span>
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
              <span className="text-2xl font-bold">{losses}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{winRate}%</span>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 bg-app-gray-dark rounded-md overflow-hidden">
          <div className="p-4 border-b border-app-gray-light">
            <h3 className="font-medium">Recent Battles</h3>
          </div>
          
          <div className="divide-y divide-app-gray-light">
            {isLoadingBattles ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              ))
            ) : battleHistory.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No battle history available
              </div>
            ) : (
              battleHistory.map((battle) => (
                <div key={battle.id} className="p-4 hover:bg-app-gray-darker transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={battle.opponent_avatar} />
                        <AvatarFallback>{battle.opponent_username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">vs @{battle.opponent_username}</span>
                          <Badge className={battle.result === "win" ? "bg-green-600 ml-2" : "bg-red-600 ml-2"}>
                            {battle.result.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(battle.date).toLocaleDateString()} • {battle.view_count} viewers
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="text-green-400">{battle.votes_received}</span>
                        <span className="mx-1">vs</span>
                        <span className="text-red-400">{battle.votes_opponent}</span>
                      </div>
                      <Button variant="link" size="sm" className="text-xs p-0 h-auto">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
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
            {isLoadingSupporters ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" />
                      <Skeleton className="h-8 w-8 rounded-full mr-3" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))
            ) : topSupporters.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No supporters data available
              </div>
            ) : (
              topSupporters.map((supporter, index) => (
                <div key={supporter.id} className="p-4 hover:bg-app-gray-darker transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 text-center mr-2 text-muted-foreground">
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={supporter.supporter_avatar} />
                        <AvatarFallback>{supporter.supporter_username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">@{supporter.supporter_username}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-yellow-400 font-semibold text-sm mr-1">⭐</span>
                      <span>{supporter.gift_amount}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {topSupporters.length > 0 && (
              <div className="p-3 text-center">
                <Button variant="link" size="sm">
                  View All Supporters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleStats;
