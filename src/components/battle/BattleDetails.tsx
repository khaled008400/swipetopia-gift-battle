
import { ChevronUp } from "lucide-react";

interface BattleDetailsProps {
  title: string;
  participants: number;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
}

const BattleDetails = ({ title, participants, showDetails, setShowDetails }: BattleDetailsProps) => {
  return (
    <>
      <button 
        className="absolute bottom-24 left-4 text-white/80 text-xs flex items-center z-10"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Less" : "More"} <ChevronUp className={`ml-1 w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
      </button>
      
      {showDetails && (
        <div className="absolute bottom-32 left-4 right-16 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg animate-fade-in z-10">
          <h4 className="text-white text-sm font-bold">{title}</h4>
          <p className="text-white/70 text-xs mt-2">{participants} participants • Live now</p>
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-white/80 text-xs">Join this battle by uploading your own video!</p>
          </div>
        </div>
      )}
    </>
  );
};

export default BattleDetails;
