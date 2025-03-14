
import { useState } from "react";
import { Eye, Gift, Clock, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStreamHistory } from "@/hooks/useStreamerData";
import { useAuth } from "@/context/AuthContext";

const StreamHistory = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState("last30");
  const { streamHistory, isLoading, error } = useStreamHistory(user?.id || '');
  
  // Calculate summary stats
  const totalViews = streamHistory.reduce((sum, stream) => sum + stream.view_count, 0);
  const totalGifts = streamHistory.reduce((sum, stream) => sum + stream.gifts_earned, 0);
  const totalCoins = streamHistory.reduce((sum, stream) => sum + stream.coins_earned, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Live Stream History</h2>
          <p className="text-sm text-muted-foreground">
            Track your past live streams performance and earnings
          </p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-app-gray-dark border border-app-gray-light rounded-md px-3 py-1 text-sm"
          >
            <option value="last7">Last 7 days</option>
            <option value="last30">Last 30 days</option>
            <option value="last90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-2xl font-bold">{totalViews.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Gifts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-center">
                <Gift className="h-5 w-5 text-purple-400 mr-2" />
                <span className="text-2xl font-bold">{totalGifts.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Coins Earned</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-center">
                <span className="text-yellow-400 font-bold text-lg mr-2">⭐</span>
                <span className="text-2xl font-bold">{totalCoins.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-app-gray-dark rounded-md">
        <div className="p-4 border-b border-app-gray-light">
          <h3 className="font-medium">Recent Streams</h3>
        </div>
        <div className="divide-y divide-app-gray-light">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-5 w-48 mb-2" />
                    <div className="flex items-center mt-1 gap-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : streamHistory.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No stream history available
            </div>
          ) : (
            streamHistory.map((stream) => (
              <div key={stream.id} className="p-4 hover:bg-app-gray-darker transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{stream.title}</h4>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground gap-3">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {new Date(stream.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {stream.duration} min
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-blue-400 mr-1" />
                      <span>{stream.view_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Gift className="h-4 w-4 text-purple-400 mr-1" />
                      <span>{stream.gifts_earned}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400 font-semibold text-sm mr-1">⭐</span>
                      <span>{stream.coins_earned}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamHistory;
