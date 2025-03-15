import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import VideoUploadModal from '@/components/upload/VideoUploadModal';
import VideoService from '@/services/video.service';

const VideosPage: React.FC = () => {
  const location = useLocation();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    // You can perform actions based on the route here
    console.log('Current route:', location.pathname);
  }, [location]);

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      <Button onClick={handleOpenUploadModal}>
        <Plus className="mr-2 h-4 w-4" />
        Upload Video
      </Button>

      <VideoUploadModal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal} />
    </div>
  );
};

export default VideosPage;
