
import { useState, useEffect } from "react";
import { Shield, Gift, Trophy, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import LiveStreamService from "@/services/live-stream.service";
import { useLiveStreamRealtime } from "@/hooks/useLiveStreamRealtime";

interface BattleInterfaceProps {
  streamId: string;
  opponentId: string;
  opponentName: string;
  opponentAvatar?: string;
  battleId: string;
  onEndBattle: () => void;
}

const BattleInterface = ({
  streamId,
  opponentId,
  opponentName,
  opponentAvatar,
  battleId,
  onEndBattle
}: BattleInterfaceProps) => {
  const { streamScore, opponentScore, resetScores } = useLiveStreamRealtime(streamId);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes in seconds
  const [isEnding, setIsEnding] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleEndBattle();
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentages for the battle score display
  const totalScore = streamScore + opponentScore;
  const yourScorePercent = totalScore > 0 ? (streamScore / totalScore) * 100 : 50;
  const opponentScorePercent = totalScore > 0 ? (opponentScore / totalScore) * 100 : 50;
  
  const handleEndBattle = async () => {
    try {
      setIsEnding(true);
      
      // Determine winner based on scores
      const winnerId = streamScore > opponentScore ? streamId : 
                       opponentScore > streamScore ? opponentId : null;
      
      await LiveStreamService.endBattle(battleId, winnerId);
      
      toast({
        title: "Battle Ended",
        description: winnerId === streamId ? 
          "Congratulations! You won the battle!" : 
          winnerId === opponentId ? 
          "You lost the battle. Better luck next time!" :
          "The battle ended in a tie!",
        duration: 5000,
      });
      
      resetScores();
      onEndBattle();
    } catch (error) {
      console.error("Error ending battle:", error);
      toast({
        title: "Error",
        description: "Failed to end the battle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnding(false);
    }
  };
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm p-4 text-white">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          <span className="font-bold text-lg">LIVE BATTLE</span>
        </div>
        <div className="flex items-center">
          <span className="bg-red-500 px-2 py-0.5 rounded-md text-sm font-medium mr-2">
            {formatTime(timeLeft)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white hover:bg-red-500/20"
            onClick={handleEndBattle}
            disabled={isEnding}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden mt-2">
        <div 
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-600 to-violet-500"
          style={{ width: `${yourScorePercent}%` }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-blue-600 to-cyan-500"
          style={{ width: `${opponentScorePercent}%` }}
        />
        
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="bg-black/60 px-3 py-0.5 rounded-full text-xs font-bold">
            {streamScore} vs {opponentScore}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-gradient-to-r from-purple-600 to-violet-500 rounded-full"></div>
          <span className="text-sm">You</span>
        </div>
        
        <div className="flex items-center">
          <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="text-xs font-medium">Top Gifter Wins!</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">{opponentName}</span>
          {opponentAvatar ? (
            <img src={opponentAvatar} alt={opponentName} className="h-6 w-6 rounded-full" />
          ) : (
            <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleInterface;
