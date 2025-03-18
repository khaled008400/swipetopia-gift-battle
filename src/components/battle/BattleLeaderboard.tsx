
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string;
  votes: number;
  rank: number;
}

interface BattleLeaderboardProps {
  battleId: string;
}

export const BattleLeaderboard = ({ battleId }: BattleLeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!battleId) return;
      
      try {
        // Get the top voters for this battle
        const { data, error } = await supabase
          .from("battle_votes")
          .select("user_id, profiles(username, avatar_url)")
          .eq("battle_id", battleId)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        // Count votes by user and create rankings
        const votesByUser: Record<string, { 
          user_id: string, 
          username: string, 
          avatar_url: string, 
          votes: number 
        }> = {};
        
        data.forEach((vote: any) => {
          const userId = vote.user_id;
          if (!votesByUser[userId]) {
            votesByUser[userId] = {
              user_id: userId,
              username: vote.profiles?.username || "Unknown User",
              avatar_url: vote.profiles?.avatar_url || "",
              votes: 0
            };
          }
          votesByUser[userId].votes += 1;
        });
        
        // Convert to array and sort by votes
        const leaderboardArray = Object.values(votesByUser)
          .sort((a, b) => b.votes - a.votes)
          .map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));
          
        setLeaderboard(leaderboardArray);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [battleId]);
  
  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (leaderboard.length === 0) {
    return (
      <div className="text-center p-4">
        <Trophy className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <h3 className="text-lg font-semibold">No votes yet</h3>
        <p className="text-sm text-muted-foreground">
          Be the first to vote in this battle!
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold flex items-center justify-center">
        <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
        Battle Leaderboard
      </h3>
      
      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <div 
            key={entry.user_id}
            className="flex items-center p-2 rounded-md border bg-card"
          >
            <div className="flex items-center justify-center w-8 h-8">
              {entry.rank === 1 ? (
                <Trophy className="h-5 w-5 text-yellow-500" />
              ) : entry.rank === 2 ? (
                <Medal className="h-5 w-5 text-gray-400" />
              ) : entry.rank === 3 ? (
                <Medal className="h-5 w-5 text-amber-700" />
              ) : (
                <span className="font-bold text-muted-foreground">{entry.rank}</span>
              )}
            </div>
            
            <Avatar className="h-10 w-10 mr-3 ml-2">
              <AvatarImage src={entry.avatar_url} />
              <AvatarFallback>{entry.username.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h4 className="font-medium">{entry.username}</h4>
              <p className="text-xs text-muted-foreground">
                {entry.votes} vote{entry.votes !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleLeaderboard;
