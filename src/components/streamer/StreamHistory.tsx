
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  Clock,
  Users,
  Gift,
  Coins,
  BarChart
} from "lucide-react";

interface StreamHistory {
  id: string;
  title: string;
  date: string;
  duration: number;
  view_count: number;
  gifts_earned: number;
  coins_earned: number;
}

const StreamHistory = () => {
  const { user } = useAuth();
  const [streams, setStreams] = useState<StreamHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_streams: 0,
    total_views: 0,
    avg_duration: 0,
    total_gifts: 0,
    total_coins: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchStreamHistory();
    }
  }, [user]);

  const fetchStreamHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('stream_history')
        .select('*')
        .eq('streamer_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      
      setStreams(data || []);
      
      // Calculate stats
      if (data && data.length > 0) {
        const totalStreams = data.length;
        const totalViews = data.reduce((sum, stream) => sum + stream.view_count, 0);
        const totalDuration = data.reduce((sum, stream) => sum + stream.duration, 0);
        const avgDuration = totalDuration / totalStreams;
        const totalGifts = data.reduce((sum, stream) => sum + stream.gifts_earned, 0);
        const totalCoins = data.reduce((sum, stream) => sum + stream.coins_earned, 0);
        
        setStats({
          total_streams: totalStreams,
          total_views: totalViews,
          avg_duration: avgDuration,
          total_gifts: totalGifts,
          total_coins: totalCoins
        });
      }
      
    } catch (error) {
      console.error("Error fetching stream history:", error);
      toast({
        title: "Error",
        description: "Failed to load your stream history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 
      ? `${hours}h ${mins}m` 
      : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-app-gray-dark border-app-gray-light">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-600/20 p-3 mr-4">
                <BarChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Stream Stats</p>
                <p className="text-2xl font-bold text-white">{stats.total_streams}</p>
                <p className="text-xs text-gray-400">streams total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark border-app-gray-light">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-600/20 p-3 mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-white">{stats.total_views.toLocaleString()}</p>
                <p className="text-xs text-gray-400">
                  {stats.total_streams > 0 
                    ? `~${Math.round(stats.total_views / stats.total_streams).toLocaleString()} per stream` 
                    : "No streams yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark border-app-gray-light">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-600/20 p-3 mr-4">
                <Coins className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Coins Earned</p>
                <p className="text-2xl font-bold text-white">{stats.total_coins.toLocaleString()}</p>
                <p className="text-xs text-gray-400">
                  {stats.total_gifts.toLocaleString()} total gifts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Stream History */}
      <Card className="bg-app-gray-dark border-app-gray-light">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Stream History</h2>
          
          {streams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">You haven't streamed yet.</p>
              <Button className="bg-app-yellow text-app-black hover:bg-app-yellow/90">
                Start Streaming
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {streams.map((stream) => {
                const streamDate = new Date(stream.date);
                
                return (
                  <div key={stream.id} className="p-4 border border-app-gray-light rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="font-semibold text-white mb-2">{stream.title}</h3>
                        
                        <div className="flex flex-wrap gap-y-2 mb-3">
                          <div className="flex items-center mr-4 text-sm text-gray-300">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {streamDate.toLocaleDateString()}
                          </div>
                          
                          <div className="flex items-center mr-4 text-sm text-gray-300">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {streamDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-300">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {formatDuration(stream.duration)}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-1 text-blue-400" />
                            <span>{stream.view_count.toLocaleString()}</span>
                            <span className="text-gray-400 ml-1">views</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <Gift className="h-4 w-4 mr-1 text-purple-400" />
                            <span>{stream.gifts_earned.toLocaleString()}</span>
                            <span className="text-gray-400 ml-1">gifts</span>
                          </div>
                          
                          <div className="flex items-center text-sm">
                            <Coins className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>{stream.coins_earned.toLocaleString()}</span>
                            <span className="text-gray-400 ml-1">coins</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex mt-3 sm:mt-0">
                        <Button size="sm" variant="outline" className="text-xs h-8">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StreamHistory;
