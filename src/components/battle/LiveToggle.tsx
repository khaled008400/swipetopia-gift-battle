
import { Switch } from "@/components/ui/switch";
import { Cast } from "lucide-react";

interface LiveToggleProps {
  checked: boolean;
  onToggle: () => void;
}

const LiveToggle = ({ checked, onToggle }: LiveToggleProps) => {
  return (
    <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/60 p-2 rounded-full">
      <Cast className="h-5 w-5 text-white" />
      <span className="text-white text-xs mr-1">Live only</span>
      <Switch 
        checked={checked} 
        onCheckedChange={onToggle} 
        className="data-[state=checked]:bg-app-yellow" 
      />
    </div>
  );
};

export default LiveToggle;
