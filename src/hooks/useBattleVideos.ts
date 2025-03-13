
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Types
export interface BattleVideo {
  id: string;
  url: string;
  user: {
    username: string;
    avatar: string;
  };
  description: string;
  likes: number;
  comments: number;
  shares: number;
  isLive?: boolean;
}

// More reliable video sources
const FALLBACK_VIDEOS = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
];

// Battle videos data with more reliable sources
const BATTLES: BattleVideo[] = [
  {
    id: "1",
    url: FALLBACK_VIDEOS[0],
    user: {
      username: "dancequeen",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    description: "Dance Battle Finals 🏆 #dance #competition #finals",
    likes: 1432,
    comments: 87,
    shares: 34,
    isLive: true
  },
  {
    id: "2",
    url: FALLBACK_VIDEOS[1],
    user: {
      username: "groovyking",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    description: "My entry for the dance battle! Vote if you like it 🔥 #dancebattle #hiphop",
    likes: 2651,
    comments: 132,
    shares: 76,
    isLive: false
  },
  {
    id: "3",
    url: FALLBACK_VIDEOS[2],
    user: {
      username: "lipqueen",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    description: "Freestyle Rap Challenge - Round 1 🎤 #rap #freestyle #competition",
    likes: 3219,
    comments: 201,
    shares: 97,
    isLive: true
  },
  {
    id: "4",
    url: FALLBACK_VIDEOS[3],
    user: {
      username: "lyricalgenius",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    description: "Responding to @lipqueen's challenge. Let's go! 🔥 #rapbattle #bars",
    likes: 2876,
    comments: 143,
    shares: 87,
    isLive: false
  },
  {
    id: "5",
    url: FALLBACK_VIDEOS[4],
    user: {
      username: "fashionista",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    description: "Fashion Face-Off Entry 👗 #fashion #style #competition",
    likes: 4532,
    comments: 234,
    shares: 123,
    isLive: false
  },
  {
    id: "6",
    url: FALLBACK_VIDEOS[5],
    user: {
      username: "styleicon",
      avatar: "https://i.pravatar.cc/150?img=6"
    },
    description: "My fashion battle submission - vintage inspired 💫 #fashionbattle #vintage",
    likes: 3965,
    comments: 187,
    shares: 105,
    isLive: true
  }
];

export const useBattleVideos = (liveVideosOnly: boolean = false) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const { toast } = useToast();

  // Function to generate a filtered feed of videos based on live status
  const getFilteredVideos = (): BattleVideo[] => {
    if (liveVideosOnly) {
      return BATTLES.filter(video => video.isLive);
    } else {
      return BATTLES.filter(video => !video.isLive);
    }
  };
  
  // Get filtered videos based on current settings
  const filteredVideos = getFilteredVideos();

  // Reset active index when component mounts
  useEffect(() => {
    setActiveVideoIndex(0);
    
    if (liveVideosOnly) {
      toast({
        title: "Live Streams",
        description: "Showing only live streams",
        duration: 2000,
      });
    } else {
      toast({
        title: "Battle Videos",
        description: "Showing battle videos",
        duration: 2000,
      });
    }
  }, [liveVideosOnly, toast]);

  return {
    activeVideoIndex,
    setActiveVideoIndex,
    liveVideosOnly,
    filteredVideos
  };
};
