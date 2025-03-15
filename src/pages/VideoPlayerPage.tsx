
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer';
import { Video } from '@/types/video.types';
import { Sheet } from '@/components/ui/sheet';

const VideoPlayerPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState(false);

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
            row_id: videoId,
            counter_name: 'view_count'
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

  const toggleComments = () => {
    setCommentsOpen(!commentsOpen);
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
  
  // Create a compatible user object for VideoInfo
  const user = {
    username: video.profiles?.username || video.creator?.username || 'Unknown User',
    avatar: video.profiles?.avatar_url || video.creator?.avatar_url || '',
    isFollowing: false
  };

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
            <VideoPlayer
              videoId={video.id}
              autoPlay={true}
              src={video.video_url}
              poster={video.thumbnail_url}
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/3 p-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">{video.title || 'Untitled Video'}</h2>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-gray-400 text-sm">{video.view_count || 0} views</span>
              </div>
            </div>
          </div>

          <div onClick={toggleComments} className="cursor-pointer">
            <h3 className="font-bold text-lg mb-3">Comments</h3>
            <Button variant="outline" className="w-full">View Comments</Button>
          </div>
          
          <Sheet open={commentsOpen} onOpenChange={setCommentsOpen}>
            {/* VideoComments will only be included when the Sheet is open */}
            {commentsOpen && (
              <div className="mt-6">
                <VideoComments 
                  videoId={video.id} 
                  isOpen={commentsOpen} 
                  onClose={() => setCommentsOpen(false)} 
                />
              </div>
            )}
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
