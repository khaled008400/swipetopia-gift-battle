
import { Switch } from "@/components/ui/switch";
import { Zap } from "lucide-react";

interface LiveToggleProps {
  checked: boolean;
  onToggle: () => void;
}

const LiveToggle = ({ checked, onToggle }: LiveToggleProps) => {
  return (
    <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/60 p-2 rounded-full backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-black/70">
      <div className={`${checked ? 'text-app-yellow animate-pulse' : 'text-white'} transition-colors duration-300`}>
        <Zap className="h-5 w-5" />
      </div>
      <span className={`text-xs mr-1 ${checked ? 'text-app-yellow font-semibold' : 'text-white'} transition-colors duration-300`}>Live only</span>
      <Switch 
        checked={checked} 
        onCheckedChange={onToggle} 
        className="data-[state=checked]:bg-app-yellow" 
      />
    </div>
  );
};

export default LiveToggle;
