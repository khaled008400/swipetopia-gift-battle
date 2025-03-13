
import { useState } from "react";
import { Users, User, Zap } from "lucide-react";

type BattleMode = 'normal' | '1v1' | '2v2';

interface BattleModeSelectorProps {
  currentMode: BattleMode;
  onModeChange: (mode: BattleMode) => void;
}

const BattleModeSelector = ({ currentMode, onModeChange }: BattleModeSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const handleModeSelect = (mode: BattleMode) => {
    onModeChange(mode);
    setIsExpanded(false);
  };
  
  return (
    <div className="relative">
      {/* Current mode button */}
      <button 
        onClick={toggleExpanded}
        className="flex items-center gap-2 bg-black/60 p-2 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-black/70"
      >
        {currentMode === 'normal' && <Zap className="h-5 w-5 text-[#FE2C55]" />}
        {currentMode === '1v1' && <User className="h-5 w-5 text-[#FE2C55]" />}
        {currentMode === '2v2' && <Users className="h-5 w-5 text-[#FE2C55]" />}
        <span className="text-xs mr-1 text-white">
          {currentMode === 'normal' ? 'Normal' : currentMode.toUpperCase()}
        </span>
      </button>
      
      {/* Expanded mode selector */}
      {isExpanded && (
        <div className="absolute top-12 right-0 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 w-32 overflow-hidden z-40 animate-fade-in">
          <div className="flex flex-col">
            <button 
              className={`flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors duration-200 ${currentMode === 'normal' ? 'bg-[#FE2C55]/20 text-[#FE2C55]' : 'text-white'}`}
              onClick={() => handleModeSelect('normal')}
            >
              <Zap className={`h-4 w-4 ${currentMode === 'normal' ? 'text-[#FE2C55]' : 'text-white'}`} />
              <span className="text-xs">Normal</span>
            </button>
            
            <button 
              className={`flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors duration-200 ${currentMode === '1v1' ? 'bg-[#FE2C55]/20 text-[#FE2C55]' : 'text-white'}`}
              onClick={() => handleModeSelect('1v1')}
            >
              <User className={`h-4 w-4 ${currentMode === '1v1' ? 'text-[#FE2C55]' : 'text-white'}`} />
              <span className="text-xs">1v1 Battle</span>
            </button>
            
            <button 
              className={`flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors duration-200 ${currentMode === '2v2' ? 'bg-[#FE2C55]/20 text-[#FE2C55]' : 'text-white'}`}
              onClick={() => handleModeSelect('2v2')}
            >
              <Users className={`h-4 w-4 ${currentMode === '2v2' ? 'text-[#FE2C55]' : 'text-white'}`} />
              <span className="text-xs">2v2 Battle</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Overlay to close dropdown when clicked outside */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default BattleModeSelector;
