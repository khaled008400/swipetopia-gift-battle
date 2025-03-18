import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LiveStream } from '@/types/livestream.types';
import LiveStreamCard from '@/components/cards/LiveStreamCard';
import VideoCard from '@/components/cards/VideoCard';
import { Video } from '@/types/video.types';
import { convertBattleVideosToVideos } from "@/utils/video-converters";

const LivePage = () => {
  const [streamers, setStreamers] = useState<LiveStream[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        const { data, error } = await supabase
          .from('live_streams')
          .select('*');

        if (error) {
          console.error("Error fetching live streams:", error);
          return;
        }

        setStreamers(data || []);
      } catch (error) {
        console.error("Error fetching live streams:", error);
      }
    };

    const fetchRelatedVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .limit(6);

        if (error) {
          console.error("Error fetching related videos:", error);
          return;
        }

        setRelatedVideos(data || []);
      } catch (error) {
        console.error("Error fetching related videos:", error);
      }
    };

    fetchLiveStreams();
    fetchRelatedVideos();
  }, []);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const isLive = (status: string) => status === "online" || status === "live";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Live Streams</h1>

      {selectedVideo && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Now Playing: {selectedVideo.title}</h2>
          {/* Placeholder for video player */}
          <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-md">
            {/* Replace with actual video player */}
            <p className="text-white text-center py-32">Video Player Here</p>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Currently Live</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {streamers
            .filter(streamer => isLive(streamer.status || ""))
            .map(streamer => (
              <LiveStreamCard key={streamer.id} stream={streamer} />
            ))}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Related Videos</h2>
        {relatedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedVideos.map(video => (
              <VideoCard key={video.id} video={video} onClickVideo={handleVideoClick} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No related videos found.</p>
        )}
      </div>
    </div>
  );
};

export default LivePage;
