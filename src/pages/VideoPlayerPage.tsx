
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoPlayerCore from '@/components/video/VideoPlayerCore';
import VideoInfo from '@/components/video/VideoInfo';
import VideoComments from '@/components/video/VideoComments';

const VideoPlayerPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('short_videos')
          .select(`
            *,
            profiles:user_id (username, avatar_url, id)
          `)
          .eq('id', videoId)
          .single();
          
        if (error) throw error;
        if (data) {
          setVideo(data);
          
          // Increment view count
          await supabase.rpc('increment_counter', {
            table_name: 'short_videos',
            column_name: 'view_count',
            row_id: videoId
          });
        }
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, [videoId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-app-black">
        <Loader2 className="w-10 h-10 text-app-yellow animate-spin" />
        <p className="mt-4 text-gray-400">Loading video...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-app-black">
        <p className="text-red-500">{error || 'Video not found'}</p>
        <Button onClick={handleBackClick} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-app-black text-white">
      <div className="sticky top-0 z-10 bg-app-black/90 backdrop-blur-sm p-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBackClick}
          className="text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        <div className="w-full md:w-2/3 bg-app-black">
          <div className="aspect-[9/16] md:aspect-video max-h-[calc(100vh-120px)] relative mx-auto">
            <VideoPlayerCore
              videoUrl={video.video_url}
              thumbnailUrl={video.thumbnail_url}
              videoId={video.id}
              autoPlay={true}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/3 p-4">
          <VideoInfo 
            title={video.title || 'Untitled Video'}
            username={video.profiles?.username || 'Unknown User'}
            avatarUrl={video.profiles?.avatar_url}
            userId={video.profiles?.id}
            description={video.description || ''}
            hashtags={video.hashtags || []}
            likeCount={video.like_count || 0}
            commentCount={video.comment_count || 0}
            videoId={video.id}
          />
          
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-3">Comments</h3>
            <VideoComments videoId={video.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
