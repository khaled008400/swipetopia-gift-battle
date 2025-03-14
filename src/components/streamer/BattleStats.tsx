
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Users, TrendingUp, CircleDollarSign, Award } from "lucide-react";

interface BattleStats {
  total_battles: number;
  wins: number;
  losses: number;
  win_rate: number;
  total_views: number;
  total_votes: number;
}

interface BattleHistory {
  id: string;
  opponent_username: string;
  opponent_avatar: string | null;
  date: string;
  result: string;
  view_count: number;
  votes_received: number;
  votes_opponent: number;
}

interface TopSupporter {
  supporter_username: string;
  supporter_avatar: string | null;
  gift_amount: number;
}

const BattleStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<BattleStats | null>(null);
  const [battles, setBattles] = useState<BattleHistory[]>([]);
  const [supporters, setSupporters] = useState<TopSupporter[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBattleData();
    }
  }, [user]);

  const fetchBattleData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch battle history
      const { data: battleData, error: battleError } = await supabase
        .from('battle_history')
        .select('*')
        .eq('streamer_id', user.id)
        .order('date', { ascending: false });

      if (battleError) throw battleError;
      
      setBattles(battleData || []);
      
      // Calculate stats from battle history
      if (battleData && battleData.length > 0) {
        const wins = battleData.filter(battle => battle.result === 'win').length;
        const total = battleData.length;
        const totalViews = battleData.reduce((sum, battle) => sum + battle.view_count, 0);
        const totalVotes = battleData.reduce((sum, battle) => sum + battle.votes_received, 0);
        
        setStats({
          total_battles: total,
          wins: wins,
          losses: total - wins,
          win_rate: total > 0 ? (wins / total) * 100 : 0,
          total_views: totalViews,
          total_votes: totalVotes
        });
      } else {
        setStats({
          total_battles: 0,
          wins: 0,
          losses: 0,
          win_rate: 0,
          total_views: 0,
          total_votes: 0
        });
      }
      
      // Fetch top supporters
      const { data: supporterData, error: supporterError } = await supabase
        .from('top_supporters')
        .select('*')
        .eq('streamer_id', user.id)
        .order('gift_amount', { ascending: false })
        .limit(5);

      if (supporterError) throw supporterError;
      
      setSupporters(supporterData || []);
    } catch (error) {
      console.error("Error fetching battle data:", error);
      toast({
        title: "Error",
        description: "Failed to load battle statistics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Battle Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-app-gray-dark border-app-gray-light">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-600/20 p-3 mr-4">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Win Rate</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold text-white">{stats?.win_rate.toFixed(1)}%</h3>
                  <p className="ml-2 text-xs text-gray-400">({stats?.wins} of {stats?.total_battles})</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark border-app-gray-light">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-600/20 p-3 mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <h3 className="text-2xl font-bold text-white">{stats?.total_views.toLocaleString()}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark border-app-gray-light">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-pink-600/20 p-3 mr-4">
                <TrendingUp className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Votes</p>
                <h3 className="text-2xl font-bold text-white">{stats?.total_votes.toLocaleString()}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Battles */}
      <Card className="bg-app-gray-dark border-app-gray-light">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Battles</h2>
          
          {battles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You haven't participated in any battles yet.</p>
              <Button className="bg-app-yellow text-app-black hover:bg-app-yellow/90">Find Battles</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {battles.slice(0, 5).map((battle) => (
                <div key={battle.id} className="flex items-center justify-between p-3 border border-app-gray-light rounded-lg">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={battle.opponent_avatar || ''} alt={battle.opponent_username} />
                      <AvatarFallback>{battle.opponent_username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">vs. {battle.opponent_username}</p>
                      <p className="text-xs text-gray-400">{new Date(battle.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-center">
                      <p className="text-xs text-gray-400">Votes</p>
                      <p className="font-medium">{battle.votes_received} - {battle.votes_opponent}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      battle.result === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {battle.result === 'win' ? 'Won' : 'Lost'}
                    </div>
                  </div>
                </div>
              ))}
              
              {battles.length > 5 && (
                <div className="text-center mt-4">
                  <Button variant="outline">View All Battles</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Top Supporters */}
      <Card className="bg-app-gray-dark border-app-gray-light">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <Award className="mr-2 h-5 w-5 text-yellow-500" />
            Top Supporters
          </h2>
          
          {supporters.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400">No supporters yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {supporters.map((supporter, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={supporter.supporter_avatar || ''} alt={supporter.supporter_username} />
                        <AvatarFallback>{supporter.supporter_username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-300' : 'bg-amber-700'
                        }`}>
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{supporter.supporter_username}</p>
                      <p className="text-xs text-gray-400">#{index + 1} Supporter</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CircleDollarSign className="h-4 w-4 mr-1 text-app-yellow" />
                    <span className="font-medium">{supporter.gift_amount.toLocaleString()}</span>
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

export default BattleStats;
