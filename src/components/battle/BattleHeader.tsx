
import { Trophy } from "lucide-react";

interface BattleHeaderProps {
  title: string;
}

const BattleHeader = ({ title }: BattleHeaderProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent">
      <div className="flex items-center">
        <Trophy className="w-5 h-5 text-app-yellow mr-2" />
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <div className="ml-auto flex items-center text-red-500 text-xs">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
          LIVE
        </div>
      </div>
    </div>
  );
};

export default BattleHeader;
