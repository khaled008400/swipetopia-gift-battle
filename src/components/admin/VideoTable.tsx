
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AdminVideo } from '@/services/admin.service';
import { CheckCircle, Flag, MoreHorizontal, Trash2 } from 'lucide-react';

interface VideoTableProps {
  videos: AdminVideo[];
  onStatusChange: (videoId: string, status: 'active' | 'flagged' | 'removed') => void;
  onDeleteVideo: (videoId: string) => void;
  onOpenPreview: (video: AdminVideo) => void;
}

const VideoTable: React.FC<VideoTableProps> = ({ 
  videos, 
  onStatusChange, 
  onDeleteVideo, 
  onOpenPreview 
}) => {
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Likes</TableHead>
          <TableHead>Comments</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {videos.map((video) => (
          <TableRow key={video.id}>
            <TableCell className="font-medium">{video.user.username}</TableCell>
            <TableCell className="max-w-xs truncate">{video.description}</TableCell>
            <TableCell>{new Date(video.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{getStatusBadge(video.status)}</TableCell>
            <TableCell>{video.likes}</TableCell>
            <TableCell>{video.comments}</TableCell>
            <TableCell>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" onClick={() => onOpenPreview(video)}>
                  Preview
                </Button>
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
        ))}
      </TableBody>
    </Table>
  );
};

export default VideoTable;
