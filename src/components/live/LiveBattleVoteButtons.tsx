
import { useState } from "react";
import { Heart, Users, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveBattleVoteButtonsProps {
  mode: '1v1' | '2v2';
  team1Name: string;
  team2Name: string;
}

const LiveBattleVoteButtons = ({ mode, team1Name, team2Name }: LiveBattleVoteButtonsProps) => {
  const [votedFor, setVotedFor] = useState<'team1' | 'team2' | null>(null);
  const [team1Votes, setTeam1Votes] = useState(Math.floor(Math.random() * 100) + 50);
  const [team2Votes, setTeam2Votes] = useState(Math.floor(Math.random() * 100) + 50);
  const { toast } = useToast();
  
  const handleVote = (team: 'team1' | 'team2') => {
    if (votedFor === team) {
      // Unvote
      setVotedFor(null);
      if (team === 'team1') {
        setTeam1Votes(prev => prev - 1);
      } else {
        setTeam2Votes(prev => prev - 1);
      }
      
      toast({
        title: "Vote removed",
        description: `You removed your vote for ${team === 'team1' ? team1Name : team2Name}`,
        duration: 2000,
      });
    } else {
      // Vote for new team, removing vote from other team if needed
      if (votedFor) {
        // Remove previous vote
        if (votedFor === 'team1') {
          setTeam1Votes(prev => prev - 1);
        } else {
          setTeam2Votes(prev => prev - 1);
        }
      }
      
      // Add new vote
      setVotedFor(team);
      if (team === 'team1') {
        setTeam1Votes(prev => prev + 1);
      } else {
        setTeam2Votes(prev => prev + 1);
      }
      
      toast({
        title: "Vote cast!",
        description: `You voted for ${team === 'team1' ? team1Name : team2Name}`,
        duration: 2000,
      });
    }
  };
  
  return (
    <div className="w-full px-4">
      <div className="mb-3 flex items-center justify-center">
        <div className="bg-black/30 backdrop-blur-sm p-1.5 rounded-full flex items-center">
          <Trophy className="h-4 w-4 text-[#FE2C55] mr-1" />
          <span className="text-white text-xs">Live Voting</span>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button 
          onClick={() => handleVote('team1')}
          className={`flex-1 relative ${
            votedFor === 'team1' 
              ? 'bg-gradient-to-r from-[#FE2C55] to-[#FF6C85] text-white' 
              : 'bg-black/50 backdrop-blur-md text-white'
          } py-3 px-4 rounded-xl flex justify-between items-center overflow-hidden`}
        >
          <div className="flex items-center gap-2 z-10">
            {mode === '2v2' ? <Users className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
            <span className="text-sm font-medium">{team1Name}</span>
          </div>
          <span className="font-bold text-sm z-10">{team1Votes}</span>
          
          {/* Background progress bar */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-white/20 z-0"
            style={{ 
              width: `${(team1Votes / (team1Votes + team2Votes)) * 100}%`, 
              transition: 'width 0.3s ease-out' 
            }}
          />
        </button>
        
        <button 
          onClick={() => handleVote('team2')}
          className={`flex-1 relative ${
            votedFor === 'team2' 
              ? 'bg-gradient-to-r from-[#FE2C55] to-[#FF6C85] text-white' 
              : 'bg-black/50 backdrop-blur-md text-white'
          } py-3 px-4 rounded-xl flex justify-between items-center overflow-hidden`}
        >
          <div className="flex items-center gap-2 z-10">
            {mode === '2v2' ? <Users className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
            <span className="text-sm font-medium">{team2Name}</span>
          </div>
          <span className="font-bold text-sm z-10">{team2Votes}</span>
          
          {/* Background progress bar */}
          <div 
            className="absolute left-0 top-0 bottom-0 bg-white/20 z-0"
            style={{ 
              width: `${(team2Votes / (team1Votes + team2Votes)) * 100}%`, 
              transition: 'width 0.3s ease-out' 
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default LiveBattleVoteButtons;
