
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BattleVoteButtonsProps {
  user1Name: string;
  user2Name: string;
  votedFor: 'user1' | 'user2' | null;
  onVote: (user: 'user1' | 'user2') => void;
}

const BattleVoteButtons = ({ user1Name, user2Name, votedFor, onVote }: BattleVoteButtonsProps) => {
  return (
    <div className="absolute bottom-6 left-0 right-0 px-4 z-10">
      <div className="flex space-x-3">
        <Button 
          className={`flex-1 ${
            votedFor === 'user1' 
              ? 'bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-white border-none shadow-lg shadow-purple-500/30' 
              : 'bg-black/40 backdrop-blur-md text-white border border-white/20'
          } rounded-xl py-6 hover:shadow-lg transition-all duration-300`}
          onClick={() => onVote('user1')}
        >
          <span className="flex-1 font-medium">Vote {user1Name}</span>
          {votedFor === 'user1' && <ArrowRight className="w-5 h-5 ml-2 animate-pulse" />}
        </Button>
        <Button 
          className={`flex-1 ${
            votedFor === 'user2' 
              ? 'bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-white border-none shadow-lg shadow-purple-500/30' 
              : 'bg-black/40 backdrop-blur-md text-white border border-white/20'
          } rounded-xl py-6 hover:shadow-lg transition-all duration-300`}
          onClick={() => onVote('user2')}
        >
          <span className="flex-1 font-medium">Vote {user2Name}</span>
          {votedFor === 'user2' && <ArrowRight className="w-5 h-5 ml-2 animate-pulse" />}
        </Button>
      </div>
    </div>
  );
};

export default BattleVoteButtons;
