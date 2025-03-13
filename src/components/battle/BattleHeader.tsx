
import { Trophy } from "lucide-react";

interface BattleHeaderProps {
  title: string;
}

const BattleHeader = ({ title }: BattleHeaderProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 p-4 z-10">
      <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
        <div className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] p-2 rounded-full mr-3 shadow-md">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-white font-bold text-lg">{title}</h3>
        <div className="ml-auto flex items-center bg-black/40 backdrop-blur-sm text-[#F97316] text-xs px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-[#F97316] rounded-full mr-1.5 animate-pulse"></div>
          BATTLE
        </div>
      </div>
    </div>
  );
};

export default BattleHeader;
