
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AdminVideo } from '@/services/admin.service';

// Import refactored components
import StatusBadge from './StatusBadge';
import UserCell from './UserCell';
import EngagementCell from './EngagementCell';
import VideoActions from './VideoActions';
import VideoActionDropdown from './VideoActionDropdown';
import TableHeadWithCheckbox from './TableHeadWithCheckbox';

interface VideoTableProps {
  videos: AdminVideo[];
  onStatusChange: (videoId: string, status: 'active' | 'flagged' | 'removed') => void;
  onDeleteVideo: (videoId: string) => void;
  onOpenPreview: (video: AdminVideo) => void;
  onViewUserProfile?: (userId: string) => void;
  onSendWarning?: (videoId: string, userId: string, message: string) => void;
  onRestrictUser?: (userId: string, reason: string) => void;
  selectedVideos?: string[];
  onSelectVideo?: (videoId: string, selected: boolean) => void;
  onSelectAllVideos?: (selected: boolean) => void;
}

const VideoTable: React.FC<VideoTableProps> = ({ 
  videos, 
  onStatusChange, 
  onDeleteVideo, 
  onOpenPreview,
  onViewUserProfile,
  onSendWarning,
  onRestrictUser,
  selectedVideos = [],
  onSelectVideo,
  onSelectAllVideos
}) => {
  // Check if all videos are selected
  const allSelected = videos.length > 0 && selectedVideos.length === videos.length;
  
  // Check if some videos are selected
  const someSelected = selectedVideos.length > 0 && selectedVideos.length < videos.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {onSelectVideo && (
            <TableHeadWithCheckbox 
              allSelected={allSelected}
              someSelected={someSelected}
              onSelectAll={(checked) => {
                if (onSelectAllVideos) {
                  onSelectAllVideos(checked);
                }
              }}
            />
          )}
          <TableHead>User</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Engagement</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {videos.map((video) => (
          <TableRow key={video.id}>
            {onSelectVideo && (
              <TableCell>
                <Checkbox 
                  checked={selectedVideos.includes(video.id)}
                  onCheckedChange={(checked) => {
                    onSelectVideo(video.id, !!checked);
                  }}
                />
              </TableCell>
            )}
            <TableCell>
              <UserCell 
                username={video.user.username}
                userId={video.user.id}
                onViewUserProfile={onViewUserProfile}
              />
            </TableCell>
            <TableCell className="max-w-xs truncate">{video.description}</TableCell>
            <TableCell>{new Date(video.createdAt).toLocaleDateString()}</TableCell>
            <TableCell><StatusBadge status={video.status} /></TableCell>
            <TableCell>
              <EngagementCell 
                likes={video.likes} 
                comments={video.comments} 
                shares={video.shares || 0} 
              />
            </TableCell>
            <TableCell>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" onClick={() => onOpenPreview(video)}>
                  Preview
                </Button>
                
                <VideoActions
                  video={video}
                  onStatusChange={onStatusChange}
                  onDeleteVideo={onDeleteVideo}
                  onViewUserProfile={onViewUserProfile}
                  onSendWarning={onSendWarning}
                  onRestrictUser={onRestrictUser}
                  compact={true}
                />
                
                <VideoActionDropdown 
                  videoId={video.id}
                  userId={video.user.id}
                  onStatusChange={onStatusChange}
                  onDeleteVideo={onDeleteVideo}
                  onViewUserProfile={onViewUserProfile}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VideoTable;
