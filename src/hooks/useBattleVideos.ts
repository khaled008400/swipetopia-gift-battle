
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

// Battle videos data
const BATTLES: BattleVideo[] = [
  {
    id: "1",
    url: "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-the-club-with-colorful-lights-3739-large.mp4",
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
    url: "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32949-large.mp4",
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
    url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-over-a-city-landscape-32746-large.mp4",
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
    url: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-waving-on-a-video-call-43892-large.mp4",
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
    url: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
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
    url: "https://assets.mixkit.co/videos/preview/mixkit-woman-modeling-in-an-empty-room-by-the-wall-42376-large.mp4",
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

export const useBattleVideos = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [liveOnly, setLiveOnly] = useState(false);
  const { toast } = useToast();

  // Function to generate a mixed feed of videos
  const generateMixedFeed = (): BattleVideo[] => {
    if (liveOnly) {
      return BATTLES.filter(video => video.isLive);
    }
    
    // For demonstration, since we have a small dataset, we'll just sort them to ensure 
    // live videos are distributed (we'd use a more sophisticated algorithm with real data)
    const allVideos = [...BATTLES].sort((a, b) => {
      // This ensures live videos are more evenly distributed
      if (a.isLive && !b.isLive) return 1;
      if (!a.isLive && b.isLive) return -1;
      return 0;
    });
    
    return allVideos;
  };
  
  // Get filtered videos based on current settings
  const filteredVideos = generateMixedFeed();

  // Reset active index when filter changes to avoid out of bounds
  useEffect(() => {
    setActiveVideoIndex(0);
    if (liveOnly) {
      toast({
        title: "Live streams only",
        description: "Showing only live streams",
        duration: 2000,
      });
    } else {
      toast({
        title: "Mixed feed",
        description: "Showing a mix of videos and live streams",
        duration: 2000,
      });
    }
  }, [liveOnly, toast]);

  // Toggle live streams only
  const handleToggleLive = () => {
    setLiveOnly(!liveOnly);
  };

  return {
    activeVideoIndex,
    setActiveVideoIndex,
    liveOnly,
    handleToggleLive,
    filteredVideos
  };
};
