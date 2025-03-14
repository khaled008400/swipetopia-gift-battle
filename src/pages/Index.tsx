import { useState } from "react";
import TrendingVideosSection from "../components/TrendingVideosSection";
import UserVideosCarousel from "../components/UserVideosCarousel";
import VideoFeed from "../components/VideoFeed";
import { useAuth } from "../context/auth/AuthContext";

const IndexPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("following");

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
                <UserVideosCarousel userId={user.id} />
                <VideoFeed />
              </>
            ) : (
              <div className="text-white text-center p-4">
                Please log in to see your personalized feed.
              </div>
            )}
          </>
        ) : (
          <TrendingVideosSection />
        )}
      </div>
    </div>
  );
};

export default IndexPage;
