
import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import VideoUploadModal from '@/components/upload/VideoUploadModal';
import VideoService from '@/services/video';
import { Video } from '@/types/video.types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import VideoCard from '@/components/cards/VideoCard';

const VideosPage: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const { requiresAuth, AuthDialog } = useAuthCheck();

  useEffect(() => {
    const shouldOpenUpload = searchParams.get('upload') === 'true';
    if (shouldOpenUpload) {
      handleOpenUploadModal();
    }
  }, [searchParams]);

  useEffect(() => {
    fetchVideos();

    const channel = supabase
      .channel('videos-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'videos' }, 
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
      const fetchedVideos = await VideoService.getVideos(50);
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

export default VideosPage;
