
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AdminVideo } from '@/services/admin.service';
import { 
  CheckCircle, Flag, MoreHorizontal, 
  Trash2, EyeOff, Users, User 
} from 'lucide-react';
import VideoActions from './VideoActions';

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
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'flagged':
        return <Badge className="bg-yellow-500">Flagged</Badge>;
      case 'removed':
        return <Badge className="bg-red-500">Removed</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  // Check if all videos are selected
  const allSelected = videos.length > 0 && selectedVideos.length === videos.length;

  // Check if some videos are selected
  const someSelected = selectedVideos.length > 0 && selectedVideos.length < videos.length;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {onSelectVideo && (
            <TableHead className="w-12">
              <Checkbox 
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={(checked) => {
                  if (onSelectAllVideos) {
                    onSelectAllVideos(!!checked);
                  }
                }}
              />
            </TableHead>
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
              <div className="flex items-center space-x-2">
                <span className="font-medium">{video.user.username}</span>
                {onViewUserProfile && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => onViewUserProfile(video.user.id)}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate">{video.description}</TableCell>
            <TableCell>{new Date(video.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{getStatusBadge(video.status)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <span title="Likes">👍 {video.likes}</span>
                <span title="Comments">💬 {video.comments}</span>
                <span title="Shares">🔄 {video.shares || 0}</span>
              </div>
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onStatusChange(video.id, 'active')}
                      className="text-green-600"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(video.id, 'flagged')}
                      className="text-yellow-600"
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Flag
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(video.id, 'removed')}
                      className="text-red-600"
                    >
                      <EyeOff className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteVideo(video.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                    {onViewUserProfile && (
                      <DropdownMenuItem
                        onClick={() => onViewUserProfile(video.user.id)}
                        className="text-blue-600"
                      >
                        <User className="mr-2 h-4 w-4" />
                        View User Profile
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VideoTable;
