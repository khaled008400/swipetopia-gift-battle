import { useState } from "react";
import TrendingVideosSection from "../components/TrendingVideosSection";
import UserVideosCarousel from "../components/UserVideosCarousel";
import VideoFeed from "../components/VideoFeed";
import { useAuth } from "../context/auth/AuthContext";

// Mock data for trending videos
const TRENDING_VIDEOS = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a",
    username: "fashion_creator"
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a",
    username: "travel_vlog"
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a",
    username: "cook_with_me"
  }
];

// Mock data for video feed - updated to match BattleVideo type
const FEED_VIDEOS = [
  {
    id: "feed1",
    url: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-a-beautiful-landscape-32807-large.mp4",
    thumbnail: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-a-beautiful-landscape-32807-large.mp4",
    description: "Running through nature",
    likes: 1200,
    comments: 85,
    shares: 45, // Added missing shares property
    user: {
      username: "Runner", // Changed from name to username for BattleVideo type
      avatar: "/placeholder.svg" // Changed from avatar to match BattleVideo type
    }
  }
];

// Updated user videos to match required props
const USER_VIDEOS = [
  {
    id: "vid1",
    title: "Nature Run",
    thumbnailUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-a-beautiful-landscape-32807-large.mp4",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-running-through-a-beautiful-landscape-32807-large.mp4",
    user: {
      id: "user1",
      username: "Runner",
      avatarUrl: "/placeholder.svg"
    }
  }
];

const IndexPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("following");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Tabs */}
        <div className="flex bg-app-gray-dark border-b border-app-gray-light">
          <button
            className={`flex-1 py-2.5 text-sm font-semibold ${
              activeTab === "following"
                ? "text-white border-b-2 border-app-yellow"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-semibold ${
              activeTab === "trending"
                ? "text-white border-b-2 border-app-yellow"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab("trending")}
          >
            Trending
          </button>
        </div>

        {/* Video Feed or Trending Videos based on active tab */}
        {activeTab === "following" ? (
          <>
            {user ? (
              <>
                <UserVideosCarousel videos={USER_VIDEOS} />
                <VideoFeed videos={FEED_VIDEOS} activeVideoIndex={activeVideoIndex} />
              </>
            ) : (
              <div className="text-white text-center p-4">
                Please log in to see your personalized feed.
              </div>
            )}
          </>
        ) : (
          <TrendingVideosSection videos={TRENDING_VIDEOS} />
        )}
      </div>
    </div>
  );
};

export default IndexPage;
