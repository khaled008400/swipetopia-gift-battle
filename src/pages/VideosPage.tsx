import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import VideoUploadModal from '@/components/upload/VideoUploadModal';
import VideoService from '@/services/video.service';
import { Video } from '@/types/video.types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import DatabaseDebug from '@/components/debug/DatabaseDebug';

const VideosPage: React.FC = () => {
  const location = useLocation();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { requiresAuth, AuthDialog } = useAuthCheck();

  useEffect(() => {
    fetchVideos();

    // Set up realtime subscription for new videos
    const channel = supabase
      .channel('videos-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'short_videos' }, 
        (payload) => {
          console.log('New video added:', payload);
          fetchVideos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching videos...');
      const fetchedVideos = await VideoService.getVideos();
      console.log('Fetched videos:', fetchedVideos);
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: 'Error',
        description: 'Failed to load videos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenUploadModal = () => {
    requiresAuth(() => {
      setIsUploadModalOpen(true);
    });
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleVideoUploadSuccess = (videoId: string) => {
    console.log('Video uploaded successfully, ID:', videoId);
    fetchVideos();
    
    toast({
      title: 'Success!',
      description: 'Your video has been uploaded and will appear shortly',
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Videos</h1>
        <Button onClick={handleOpenUploadModal}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Video
        </Button>
      </div>

      {/* Add debug component */}
      <div className="mb-6">
        <DatabaseDebug />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : videos.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Upload className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No videos yet</h3>
          <p className="text-gray-500 mb-4">Upload your first video to get started</p>
          <Button onClick={handleOpenUploadModal}>Upload Video</Button>
        </div>
      )}

      <VideoUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={handleCloseUploadModal} 
        onSuccess={handleVideoUploadSuccess}
      />
      
      <AuthDialog />
    </div>
  );
};

const VideoCard = ({ video }: { video: Video }) => {
  console.log('Rendering video card:', video);
  return (
    <div className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[9/16] bg-black relative">
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url} 
            alt={video.title} 
            className="w-full h-full object-cover"
          />
        ) : video.video_url ? (
          <video 
            src={video.video_url} 
            className="w-full h-full object-cover" 
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <span className="text-white">Video Preview</span>
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {video.view_count || 0} views
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{video.title}</h3>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <span>{video.profiles?.username || 'User'}</span>
          <span className="mx-1">•</span>
          <span>{new Date(video.created_at || '').toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default VideosPage;
