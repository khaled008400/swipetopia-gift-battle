
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface BattleVotingProps {
  leftVideo: any;
  rightVideo: any;
  onVote: (videoId: string) => void;
  hasVoted: boolean;
}

export const BattleVoting = ({ leftVideo, rightVideo, onVote, hasVoted }: BattleVotingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  
  // Calculate percentages for the progress bar
  const leftVotes = leftVideo?.votes_count || 0;
  const rightVotes = rightVideo?.votes_count || 0;
  const totalVotes = leftVotes + rightVotes;
  
  const leftPercentage = totalVotes === 0 ? 50 : Math.round((leftVotes / totalVotes) * 100);
  const rightPercentage = totalVotes === 0 ? 50 : Math.round((rightVotes / totalVotes) * 100);
  
  const handleVote = async (videoId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote for videos",
        variant: "destructive",
      });
      return;
    }
    
    if (hasVoted) {
      toast({
        title: "Already voted",
        description: "You've already cast your vote for this battle",
      });
      return;
    }
    
    setIsVoting(true);
    try {
      await onVote(videoId);
      
      toast({
        title: "Vote cast!",
        description: "Your vote has been recorded",
      });
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to cast your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };
  
  return (
    <div className="p-2 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-1">Vote for your favorite</h3>
        <p className="text-sm text-muted-foreground">
          {hasVoted 
            ? "Thanks for voting! Current results:" 
            : "Cast your vote to support your favorite creator"}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Left Video */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={leftVideo?.user?.avatar_url || leftVideo?.profiles?.avatar_url} />
            <AvatarFallback>
              {(leftVideo?.user?.username || leftVideo?.profiles?.username || "User")?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h4 className="font-semibold">
            {leftVideo?.user?.username || leftVideo?.profiles?.username || "Creator 1"}
          </h4>
          
          {hasVoted ? (
            <div className="w-full text-center">
              <span className="text-lg font-bold">{leftPercentage}%</span>
              <span className="text-xs text-muted-foreground ml-1">({leftVotes} votes)</span>
            </div>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => handleVote(leftVideo?.id)}
              disabled={isVoting || !leftVideo}
            >
              Vote
            </Button>
          )}
        </div>
        
        {/* Right Video */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={rightVideo?.user?.avatar_url || rightVideo?.profiles?.avatar_url} />
            <AvatarFallback>
              {(rightVideo?.user?.username || rightVideo?.profiles?.username || "User")?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h4 className="font-semibold">
            {rightVideo?.user?.username || rightVideo?.profiles?.username || "Creator 2"}
          </h4>
          
          {hasVoted ? (
            <div className="w-full text-center">
              <span className="text-lg font-bold">{rightPercentage}%</span>
              <span className="text-xs text-muted-foreground ml-1">({rightVotes} votes)</span>
            </div>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => handleVote(rightVideo?.id)}
              disabled={isVoting || !rightVideo}
            >
              Vote
            </Button>
          )}
        </div>
      </div>
      
      {/* Progress bar to show voting stats */}
      {hasVoted && (
        <div className="pt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>{leftPercentage}%</span>
            <span>{rightPercentage}%</span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-primary rounded-l-full"
              style={{ width: `${leftPercentage}%` }}
            />
            <div 
              className="absolute right-0 top-0 h-full bg-secondary rounded-r-full"
              style={{ width: `${rightPercentage}%` }}
            />
          </div>
          <div className="text-center text-xs text-muted-foreground mt-1">
            Total votes: {totalVotes}
          </div>
        </div>
      )}
    </div>
  );
};

export default BattleVoting;
