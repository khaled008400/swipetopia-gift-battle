
import { Button } from "../ui/button";

interface BattleVoteButtonsProps {
  user1Name: string;
  user2Name: string;
  votedFor: 'user1' | 'user2' | null;
  onVote: (user: 'user1' | 'user2') => void;
}

const BattleVoteButtons = ({ user1Name, user2Name, votedFor, onVote }: BattleVoteButtonsProps) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 px-4">
      <div className="flex space-x-3">
        <Button 
          className={`flex-1 ${votedFor === 'user1' ? 'bg-app-yellow text-app-black' : 'bg-app-gray-dark text-white'}`}
          onClick={() => onVote('user1')}
        >
          Vote {user1Name}
        </Button>
        <Button 
          className={`flex-1 ${votedFor === 'user2' ? 'bg-app-yellow text-app-black' : 'bg-app-gray-dark text-white'}`}
          onClick={() => onVote('user2')}
        >
          Vote {user2Name}
        </Button>
      </div>
    </div>
  );
};

export default BattleVoteButtons;
