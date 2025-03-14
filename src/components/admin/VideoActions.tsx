
import React from 'react';
import { Button } from '@/components/ui/button';
import { AdminVideo } from '@/services/admin.service';
import { CheckCircle, Flag, Trash2 } from 'lucide-react';

interface VideoActionsProps {
  video: AdminVideo;
  onStatusChange: (videoId: string, status: 'active' | 'flagged' | 'removed') => void;
  onDeleteVideo: (videoId: string) => void;
}

const VideoActions: React.FC<VideoActionsProps> = ({ 
  video, 
  onStatusChange, 
  onDeleteVideo 
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        onClick={() => onStatusChange(video.id, 'active')}
        className="text-green-600"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Approve
      </Button>
      <Button
        variant="outline"
        onClick={() => onStatusChange(video.id, 'flagged')}
        className="text-yellow-600"
      >
        <Flag className="mr-2 h-4 w-4" />
        Flag
      </Button>
      <Button
        variant="outline"
        onClick={() => onDeleteVideo(video.id)}
        className="text-red-600"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

export default VideoActions;
