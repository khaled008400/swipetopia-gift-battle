
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminVideo } from '@/services/admin.service';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import refactored components
import VideoTable from './VideoTable';
import VideoPreviewDialog from './VideoPreviewDialog';
import VideosFilter from './VideosFilter';
import VideosPagination from './VideosPagination';

const AdminVideos = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<AdminVideo | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminVideos', page, statusFilter],
    queryFn: () => AdminService.getVideos(page, statusFilter),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ videoId, status }: { videoId: string, status: 'active' | 'flagged' | 'removed' }) => 
      AdminService.updateVideoStatus(videoId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
      toast({
        title: "Status updated",
        description: "Video status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update video status.",
        variant: "destructive",
      });
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId: string) => AdminService.deleteVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
      toast({
        title: "Video deleted",
        description: "Video has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete video.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (videoId: string, status: 'active' | 'flagged' | 'removed') => {
    updateStatusMutation.mutate({ videoId, status });
  };

  const handleDeleteVideo = (videoId: string) => {
    if (confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      deleteVideoMutation.mutate(videoId);
    }
  };

  const handleOpenPreview = (video: AdminVideo) => {
    setSelectedVideo(video);
    setShowPreviewDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Videos</h2>
        <VideosFilter 
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <VideoTable 
            videos={data?.data || []}
            onStatusChange={handleStatusChange}
            onDeleteVideo={handleDeleteVideo}
            onOpenPreview={handleOpenPreview}
          />

          {data?.pagination && (
            <VideosPagination 
              currentPage={page}
              totalPages={data.pagination.last_page}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <VideoPreviewDialog 
        video={selectedVideo}
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        onStatusChange={handleStatusChange}
        onDeleteVideo={handleDeleteVideo}
      />
    </div>
  );
};

export default AdminVideos;
