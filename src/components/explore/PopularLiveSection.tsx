
import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface Creator {
  id: string;
  avatar: string;
  name: string;
  viewerCount?: number;
  title?: string;
}

interface PopularLiveSectionProps {
  creators: Creator[];
}

export const PopularLiveSection = ({ creators }: PopularLiveSectionProps) => {
  if (creators.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Zap className="w-5 h-5 text-app-yellow mr-1" />
        <h3 className="text-lg font-medium">Popular Live</h3>
      </div>
      <div className="flex overflow-x-auto no-scrollbar space-x-3 py-1">
        {creators.map((creator) => (
          <Link 
            to={`/live/${creator.id}`} 
            key={creator.id} 
            className="flex flex-col items-center min-w-[70px]"
          >
            <div className="w-16 h-16 rounded-full relative">
              <div className="absolute inset-0 rounded-full border-2 border-app-yellow animate-pulse"></div>
              <img 
                src={creator.avatar} 
                alt={creator.name} 
                className="w-full h-full rounded-full object-cover border-2 border-app-yellow"
              />
              {creator.viewerCount !== undefined && (
                <div className="absolute -bottom-1 -right-1 bg-app-yellow text-app-black text-xs font-bold px-1 rounded-full">
                  {creator.viewerCount}
                </div>
              )}
            </div>
            <span className="text-white text-xs mt-1 truncate w-16 text-center">{creator.name}</span>
            {creator.title && (
              <span className="text-gray-400 text-xs truncate w-16 text-center">{creator.title}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};
