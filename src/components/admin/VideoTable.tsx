
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Check, Eye, MoreHorizontal, User, Flag, Ban, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AdminVideo } from '@/services/admin.service';

interface VideoTableProps {
  videos: AdminVideo[];
  onStatusChange: (videoId: string, status: 'active' | 'flagged' | 'removed') => void;
  onDeleteVideo: (videoId: string) => void;
  onOpenPreview: (video: AdminVideo) => void;
  onViewUserProfile: (userId: string) => void;
  onSendWarning: (videoId: string, userId: string, message: string) => void;
  onRestrictUser: (userId: string, reason: string) => void;
  selectedVideos: string[];
  onSelectVideo: (videoId: string, selected: boolean) => void;
  onSelectAllVideos: (selected: boolean) => void;
}

const VideoTable: React.FC<VideoTableProps> = ({
  videos,
  onStatusChange,
  onDeleteVideo,
  onOpenPreview,
  onViewUserProfile,
  onSendWarning,
  onRestrictUser,
  selectedVideos,
  onSelectVideo,
  onSelectAllVideos,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><Check className="mr-1 h-3 w-3" /> Active</Badge>;
      case 'flagged':
        return <Badge className="bg-yellow-500"><Flag className="mr-1 h-3 w-3" /> Flagged</Badge>;
      case 'removed':
        return <Badge className="bg-red-500"><Ban className="mr-1 h-3 w-3" /> Removed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const areAllVideosSelected = videos.length > 0 && videos.every(video => selectedVideos.includes(video.id));

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={areAllVideosSelected}
                onCheckedChange={onSelectAllVideos}
                aria-label="Select all videos"
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {videos.length > 0 ? (
            videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedVideos.includes(video.id)}
                    onCheckedChange={(checked) => onSelectVideo(video.id, checked === true)}
                    aria-label={`Select video ${video.title}`}
                  />
                </TableCell>
                <TableCell className="font-medium max-w-[300px] truncate">
                  {video.title}
                </TableCell>
                <TableCell>
                  <div 
                    className="flex items-center space-x-2 cursor-pointer hover:text-primary"
                    onClick={() => onViewUserProfile(video.user.id)}
                  >
                    <div className="h-8 w-8 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                      {video.user.avatar_url ? (
                        <img src={video.user.avatar_url} alt={video.user.username} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <span>{video.user.username}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(video.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {video.view_count.toLocaleString()}
                </TableCell>
                <TableCell>
                  {getStatusBadge(video.status)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onOpenPreview(video)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Preview</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewUserProfile(video.user.id)}>
                          <User className="mr-2 h-4 w-4" />
                          View User Profile
                        </DropdownMenuItem>
                        {video.status !== 'active' && (
                          <DropdownMenuItem onClick={() => onStatusChange(video.id, 'active')}>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {video.status !== 'flagged' && (
                          <DropdownMenuItem onClick={() => onStatusChange(video.id, 'flagged')}>
                            <Flag className="mr-2 h-4 w-4" />
                            Flag
                          </DropdownMenuItem>
                        )}
                        {video.status !== 'removed' && (
                          <DropdownMenuItem onClick={() => onStatusChange(video.id, 'removed')}>
                            <Ban className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            const warning = prompt('Enter warning message for user:');
                            if (warning) {
                              onSendWarning(video.id, video.user.id, warning);
                            }
                          }}
                        >
                          <Flag className="mr-2 h-4 w-4" />
                          Send Warning to User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            const reason = prompt('Enter reason for user restriction:');
                            if (reason) {
                              onRestrictUser(video.user.id, reason);
                            }
                          }}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Restrict User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDeleteVideo(video.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                No videos found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VideoTable;
