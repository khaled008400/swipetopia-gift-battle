
import { Zap } from "lucide-react";

interface Creator {
  id: string;
  avatar: string;
  name: string;
}

interface PopularLiveSectionProps {
  creators: Creator[];
}

const PopularLiveSection = ({ creators }: PopularLiveSectionProps) => {
  return (
    <div className="absolute top-4 left-0 right-0 px-4 z-20">
      <div className="flex items-center mb-2">
        <Zap className="w-4 h-4 text-white mr-1" />
        <h3 className="text-white font-medium">Popular Live</h3>
      </div>
      <div className="flex overflow-x-auto no-scrollbar space-x-3 py-1">
        {creators.map((creator) => (
          <div key={creator.id} className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-app-yellow p-1">
              <img 
                src={creator.avatar} 
                alt={creator.name} 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="text-white text-xs mt-1">{creator.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularLiveSection;
