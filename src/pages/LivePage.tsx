
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LiveStream } from '@/types/livestream.types';
import LiveStreamCard from '@/components/cards/LiveStreamCard';
import VideoCard from '@/components/cards/VideoCard';
import { Video } from '@/types/video.types';
import { convertBattleVideosToVideos } from "@/utils/video-converters";
import { Loader2 } from 'lucide-react';

const LivePage = () => {
  const [streamers, setStreamers] = useState<LiveStream[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('live_streams')
          .select(`
            *,
            profiles:user_id (
              username,
              avatar_url
            )
          `);

        if (error) {
          console.error("Error fetching live streams:", error);
          return;
        }

        // Map the profiles data to match our expected LiveStream format
        const mappedData = data?.map(stream => ({
          ...stream,
          username: stream.profiles?.username,
          avatar_url: stream.profiles?.avatar_url,
        })) || [];

        setStreamers(mappedData);
      } catch (error) {
        console.error("Error fetching live streams:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRelatedVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select(`
            *,
            user:user_id (
              username,
              avatar_url
            )
          `)
          .limit(6);

        if (error) {
          console.error("Error fetching related videos:", error);
          return;
        }

        // Transform the data to match our Video type
        const videos: Video[] = data?.map(video => ({
          ...video,
          user: {
            username: video.user?.username || 'Unknown',
            avatar: video.user?.avatar_url || '',
            avatar_url: video.user?.avatar_url || '',
          },
        })) || [];

        setRelatedVideos(videos);
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

  const isLive = (stream: LiveStream) => stream.status === "online" || stream.status === "live";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Live Streams</h1>

      {selectedVideo && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Now Playing: {selectedVideo.title}</h2>
          {/* Placeholder for video player */}
          <div className="aspect-video bg-gray-800 rounded-md">
            {/* Replace with actual video player */}
            <p className="text-white text-center py-32">Video Player Here</p>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Currently Live</h2>
        {streamers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {streamers
              .filter(streamer => isLive(streamer))
              .map(streamer => (
                <LiveStreamCard key={streamer.id} stream={streamer} />
              ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No one is streaming right now. Check back later!</p>
        )}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Videos</h2>
        {relatedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedVideos.map(video => (
              <VideoCard key={video.id} video={video} onClickVideo={handleVideoClick} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No related videos found.</p>
        )}
      </div>
    </div>
  );
};

export default LivePage;
