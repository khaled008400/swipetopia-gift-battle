
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Flag, MoreHorizontal, Trash2, UserX, Ban } from 'lucide-react';
import { format } from 'date-fns';
import { AdminVideo } from '@/services/admin.service';

interface VideoTableProps {
  videos: AdminVideo[];
  onViewVideo: (video: AdminVideo) => void;
  onFlagVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string) => void;
  onWarnUser: (userId: string, videoId: string) => void;
  onRestrictUser: (userId: string) => void;
}

const VideoTable: React.FC<VideoTableProps> = ({
  videos,
  onViewVideo,
  onFlagVideo,
  onDeleteVideo,
  onWarnUser,
  onRestrictUser
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'flagged':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Flagged</Badge>;
      case 'removed':
        return <Badge variant="destructive">Removed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Video</TableHead>
          <TableHead>Creator</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Stats</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {videos.length > 0 ? (
          videos.map((video) => (
            <TableRow key={video.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-20 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                        <span className="text-xs text-gray-500">No thumbnail</span>
                      </div>
                    )}
                  </div>
                  <div className="max-w-[200px]">
                    <div className="font-medium truncate">{video.title}</div>
                    <div className="text-sm text-gray-500 truncate">{video.description}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="h-7 w-7 rounded-full overflow-hidden">
                    <img
                      src={video.user.avatar_url || "/placeholder-avatar.jpg"}
                      alt={video.user.username}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span>{video.user.username}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(video.status)}</TableCell>
              <TableCell>
                {video.created_at ? format(new Date(video.created_at), 'MMM d, yyyy') : 'Unknown'}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>Views: {video.view_count.toLocaleString()}</div>
                  <div>Likes: {video.likes_count.toLocaleString()}</div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onViewVideo(video)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onFlagVideo(video.id)}>
                        <Flag className="mr-2 h-4 w-4" />
                        Flag Video
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onWarnUser(video.user_id, video.id)}>
                        <UserX className="mr-2 h-4 w-4" />
                        Warn Creator
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRestrictUser(video.user_id)}>
                        <Ban className="mr-2 h-4 w-4" />
                        Restrict Creator
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteVideo(video.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Video
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              No videos found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default VideoTable;
