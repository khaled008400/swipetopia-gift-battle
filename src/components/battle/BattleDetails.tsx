
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
        className="absolute bottom-20 left-4 text-gray-400 text-xs flex items-center"
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? "Less" : "More"} <ChevronUp className={`ml-1 w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`} />
      </button>
      
      {showDetails && (
        <div className="absolute bottom-24 left-4 right-16 bg-black/70 p-3 rounded-lg animate-fade-in">
          <p className="text-white text-sm">{title}</p>
          <p className="text-gray-300 text-xs mt-1">{participants} participants • Live now</p>
        </div>
      )}
    </>
  );
};

export default BattleDetails;
