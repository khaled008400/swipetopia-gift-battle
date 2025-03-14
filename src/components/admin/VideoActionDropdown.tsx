
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  CheckCircle, Flag, MoreHorizontal, 
  Trash2, EyeOff, User
} from 'lucide-react';

interface VideoActionDropdownProps {
  videoId: string;
  userId: string;
  onStatusChange: (videoId: string, status: 'active' | 'flagged' | 'removed') => void;
  onDeleteVideo: (videoId: string) => void;
  onViewUserProfile?: (userId: string) => void;
}

const VideoActionDropdown: React.FC<VideoActionDropdownProps> = ({ 
  videoId, 
  userId,
  onStatusChange, 
  onDeleteVideo,
  onViewUserProfile 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onStatusChange(videoId, 'active')}
          className="text-green-600"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(videoId, 'flagged')}
          className="text-yellow-600"
        >
          <Flag className="mr-2 h-4 w-4" />
          Flag
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusChange(videoId, 'removed')}
          className="text-red-600"
        >
          <EyeOff className="mr-2 h-4 w-4" />
          Remove
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteVideo(videoId)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        {onViewUserProfile && (
          <DropdownMenuItem
            onClick={() => onViewUserProfile(userId)}
            className="text-blue-600"
          >
            <User className="mr-2 h-4 w-4" />
            View User Profile
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VideoActionDropdown;
