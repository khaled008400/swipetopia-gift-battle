import { useState, useEffect } from "react";
import { Users } from "lucide-react";
interface ActiveStreamer {
  id: string;
  username: string;
  avatar: string;
  viewerCount: number;
  isLive: boolean;
  thumbnail?: string;
}

// Mock data for active streamers
const ACTIVE_STREAMERS: ActiveStreamer[] = [{
  id: "1",
  username: "dancequeen",
  avatar: "https://i.pravatar.cc/150?img=1",
  viewerCount: 240,
  isLive: true,
  thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
}, {
  id: "2",
  username: "lipqueen",
  avatar: "https://i.pravatar.cc/150?img=3",
  viewerCount: 187,
  isLive: true,
  thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg"
}, {
  id: "3",
  username: "styleicon",
  avatar: "https://i.pravatar.cc/150?img=6",
  viewerCount: 312,
  isLive: true,
  thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg"
}, {
  id: "4",
  username: "beatmaker",
  avatar: "https://i.pravatar.cc/150?img=8",
  viewerCount: 156,
  isLive: true,
  thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg"
}, {
  id: "5",
  username: "gamerpro",
  avatar: "https://i.pravatar.cc/150?img=11",
  viewerCount: 427,
  isLive: true,
  thumbnail: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg"
}];
interface ActiveStreamersProps {
  onStreamerSelect: (streamerId: string) => void;
  selectedStreamerId: string | null;
}
const ActiveStreamers = ({
  onStreamerSelect,
  selectedStreamerId
}: ActiveStreamersProps) => {
  const [streamers, setStreamers] = useState<ActiveStreamer[]>([]);
  useEffect(() => {
    // In a real app, we would fetch active streamers from an API
    // For now, we'll use the mock data
    setStreamers(ACTIVE_STREAMERS);
  }, []);
  return <div className="absolute top-4 left-0 right-0 z-30 py-0 px-0 bg-[#93aeb7]/[0.46] my-[-08px] rounded-full">
      
      <div className="flex overflow-x-auto no-scrollbar space-x-3 py-0 px-0 my-0">
        {streamers.map(streamer => <div key={streamer.id} className={`flex flex-col items-center cursor-pointer transition-all ${selectedStreamerId === streamer.id ? "scale-110" : ""}`} onClick={() => onStreamerSelect(streamer.id)}>
            <div className={`relative w-16 h-16 rounded-full p-0.5 ${selectedStreamerId === streamer.id ? "border-2 border-app-yellow" : "border border-red-500 animate-pulse"}`}>
              <img src={streamer.avatar} alt={streamer.username} className="w-full h-full rounded-full object-scale-down" />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-1.5 rounded-full flex items-center">
                <Users className="w-3 h-3 mr-0.5" /> 
                {streamer.viewerCount}
              </div>
            </div>
            <span className="text-white text-xs mt-1 max-w-16 truncate">@{streamer.username}</span>
          </div>)}
      </div>
    </div>;
};
export default ActiveStreamers;