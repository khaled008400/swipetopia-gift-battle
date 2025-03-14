
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminVideo } from '@/services/admin.service';
import VideoActions from './VideoActions';

interface VideoPreviewDialogProps {
  video: AdminVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (videoId: string, status: 'active' | 'flagged' | 'removed') => void;
  onDeleteVideo: (videoId: string) => void;
}

const VideoPreviewDialog: React.FC<VideoPreviewDialogProps> = ({
  video,
  open,
  onOpenChange,
  onStatusChange,
  onDeleteVideo
}) => {
  if (!video) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'flagged':
        return <Badge className="bg-yellow-500">Flagged</Badge>;
      case 'removed':
        return <Badge className="bg-red-500">Removed</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Video Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative aspect-video">
            <video
              src={video.url}
              controls
              className="absolute inset-0 w-full h-full object-contain bg-black"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold">User:</span>
              <span>{video.user.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">Status:</span>
              <span>{getStatusBadge(video.status)}</span>
            </div>
            <div>
              <span className="font-bold">Description:</span>
              <p className="mt-1">{video.description}</p>
            </div>
            <div className="flex space-x-4">
              <div>
                <span className="font-bold">Likes:</span> {video.likes}
              </div>
              <div>
                <span className="font-bold">Comments:</span> {video.comments}
              </div>
              <div>
                <span className="font-bold">Shares:</span> {video.shares}
              </div>
            </div>
          </div>
          
          <VideoActions 
            video={video} 
            onStatusChange={onStatusChange} 
            onDeleteVideo={onDeleteVideo} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewDialog;
