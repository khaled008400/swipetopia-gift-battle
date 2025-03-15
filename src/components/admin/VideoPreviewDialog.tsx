
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdminVideo } from '@/services/admin.service';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle, Trash } from 'lucide-react';

export interface VideoPreviewDialogProps {
  video: AdminVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (videoId: string, status: "active" | "flagged" | "removed") => void;
  onDeleteVideo?: (videoId: string) => void;
}

const VideoPreviewDialog: React.FC<VideoPreviewDialogProps> = ({ 
  video, 
  open, 
  onOpenChange,
  onStatusChange,
  onDeleteVideo
}) => {
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
            
            {onStatusChange && (
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-green-600" 
                  onClick={() => onStatusChange(video.id, "active")}
                >
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-amber-600" 
                  onClick={() => onStatusChange(video.id, "flagged")}
                >
                  <AlertCircle className="h-4 w-4 mr-1" /> Flag
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600" 
                  onClick={() => onStatusChange(video.id, "removed")}
                >
                  <Trash className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            )}
            
            {onDeleteVideo && (
              <div className="mt-4">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDeleteVideo(video.id)}
                >
                  <Trash className="h-4 w-4 mr-1" /> Delete Permanently
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewDialog;
