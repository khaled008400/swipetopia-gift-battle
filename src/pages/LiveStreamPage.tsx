import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveStreamService from "@/services/live-stream.service";
import { useAuth } from "@/context/AuthContext";
import { LiveStream } from "@/types/livestream.types";
import { convertBattleVideosToVideos } from "@/utils/video-converters";
import VideoFeed from "@/components/VideoFeed";

const LiveStreamPage = () => {
  const { liveStreamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [liveStream, setLiveStream] = useState<LiveStream | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState("videos");

  useEffect(() => {
    const fetchLiveStream = async () => {
      if (!liveStreamId) return;

      try {
        setLoading(true);
        const streamData = await LiveStreamService.getLiveStream(liveStreamId);
        setLiveStream(streamData);

        // Fetch related videos
        const videos = await LiveStreamService.getRelatedVideos(liveStreamId);
        setRelatedVideos(videos);

        setError(null);
      } catch (err) {
        console.error("Error fetching live stream:", err);
        setError("Failed to load live stream");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStream();
  }, [liveStreamId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !liveStream) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Live Stream Not Found</h2>
        <p className="text-muted-foreground mb-6">{error || "This live stream doesn't exist or has been removed."}</p>
        <Button onClick={() => navigate("/")}>Browse Live Streams</Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{liveStream?.title || "Live Stream"}</h1>
        <div className="flex items-center space-x-2">
          <span>{liveStream?.username}</span>
        </div>
      </div>
      
      {selectedTab === "videos" && (
        <div className="flex-1 overflow-hidden">
          <VideoFeed
            videos={convertBattleVideosToVideos(relatedVideos)} 
            activeIndex={activeVideoIndex}
            onVideoChange={setActiveVideoIndex}
          />
        </div>
      )}
    </div>
  );
};

export default LiveStreamPage;
