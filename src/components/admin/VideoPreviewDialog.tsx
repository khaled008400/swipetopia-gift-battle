
import React from 'react';
import { AdminVideo } from '@/services/admin.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import VideoActions from './VideoActions';

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

  const videoUrl = video.video_url;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{video.title}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center mt-1 space-x-2">
              <span>Uploaded by</span> 
              <span className="font-medium">{video.user.username}</span>
              <span>on</span> 
              <span>{format(new Date(video.created_at), 'MMM d, yyyy')}</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
            <video
              src={videoUrl}
              poster={video.thumbnail_url}
              controls
              className="h-full w-full object-cover"
            />
          </AspectRatio>
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{video.view_count} views</Badge>
              <Badge variant="outline">{video.likes_count} likes</Badge>
              <Badge variant="outline">{video.comments_count} comments</Badge>
              {video.status && (
                <Badge 
                  className={`
                    ${video.status === 'active' ? 'bg-green-500' : ''}
                    ${video.status === 'flagged' ? 'bg-yellow-500' : ''}
                    ${video.status === 'removed' ? 'bg-red-500' : ''}
                  `}
                >
                  {video.status}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-500">
              {video.description || 'No description provided.'}
            </p>
          </div>
          
          {(onStatusChange || onDeleteVideo) && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Moderation Actions</h3>
              <VideoActions 
                video={video}
                onStatusChange={(videoId, status) => {
                  if (onStatusChange) onStatusChange(videoId, status);
                }}
                onDeleteVideo={(videoId) => {
                  if (onDeleteVideo) onDeleteVideo(videoId);
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewDialog;
