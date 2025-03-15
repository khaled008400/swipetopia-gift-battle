
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdminVideo } from '@/services/admin.service';

interface VideoPreviewDialogProps {
  video: AdminVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoPreviewDialog: React.FC<VideoPreviewDialogProps> = ({ video, open, onOpenChange }) => {
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="aspect-video overflow-hidden rounded-md bg-black">
            <video 
              src={video.video_url || video.url} // Use video_url or url if available
              controls
              className="w-full h-full"
              poster={video.thumbnail_url}
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img 
                  src={video.user.avatar_url || "/placeholder-avatar.jpg"} 
                  alt={video.user.username} 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-medium">{video.user.username}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">{video.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewDialog;
