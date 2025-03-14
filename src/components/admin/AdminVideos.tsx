import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminVideo, AdminUser } from '@/services/admin.service';
import { Loader2, Trash2, CheckCircle, Flag, Ban, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

import VideoTable from './VideoTable';
import VideoPreviewDialog from './VideoPreviewDialog';
import VideosFilter from './VideosFilter';
import VideosPagination from './VideosPagination';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminVideos = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [selectedVideo, setSelectedVideo] = useState<AdminVideo | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [batchActionDialog, setBatchActionDialog] = useState<{
    open: boolean;
    type: 'approve' | 'flag' | 'remove' | 'delete' | 'warn' | 'restrict';
  }>({ open: false, type: 'approve' });
  const [batchActionReason, setBatchActionReason] = useState('');
  const [userDetailsDialog, setUserDetailsDialog] = useState<{
    open: boolean;
    user: AdminUser | null;
  }>({ open: false, user: null });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminVideos', page, statusFilter, userFilter, dateFilter, search],
    queryFn: () => {
      const dateString = dateFilter ? dateFilter.toISOString().split('T')[0] : '';
      return AdminService.getVideosList(page);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ videoIds, status }: { videoIds: string[], status: 'active' | 'under_review' | 'removed' | 'flagged' }) => 
      Promise.all(videoIds.map(id => AdminService.updateVideoStatus(id, status))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
      toast({
        title: "Status updated",
        description: "Video status has been updated successfully.",
      });
      setSelectedVideos([]);
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
    mutationFn: (videoIds: string[]) => 
      Promise.all(videoIds.map(id => AdminService.deleteVideo(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
      toast({
        title: "Videos deleted",
        description: "Videos have been deleted successfully.",
      });
      setSelectedVideos([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete videos.",
        variant: "destructive",
      });
    },
  });

  const sendWarningMutation = useMutation({
    mutationFn: ({ videoId, userId, message }: { videoId: string, userId: string, message: string }) => 
      AdminService.sendUserWarning(userId, message, videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
      toast({
        title: "Warning sent",
        description: "Warning has been sent to the user.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send warning.",
        variant: "destructive",
      });
    },
  });

  const restrictUserMutation = useMutation({
    mutationFn: ({ userId, reason, duration = "30days" }: { userId: string, reason: string, duration?: string }) => 
      AdminService.restrictUser(userId, reason, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
      toast({
        title: "User restricted",
        description: "User has been restricted from uploading new content.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to restrict user.",
        variant: "destructive",
      });
    },
  });

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['adminUser', userDetailsDialog.user?.id],
    queryFn: () => userDetailsDialog.user?.id ? AdminService.getUser(userDetailsDialog.user.id) : null,
    enabled: !!userDetailsDialog.user?.id && userDetailsDialog.open,
  });

  const handleStatusChange = (videoId: string, status: 'active' | 'flagged' | 'removed') => {
    updateStatusMutation.mutate({ videoIds: [videoId], status });
  };

  const handleDeleteVideo = (videoId: string) => {
    if (confirm("Are you sure you want to delete this video? This action cannot be undone.")) {
      deleteVideoMutation.mutate([videoId]);
    }
  };

  const handleOpenPreview = (video: AdminVideo) => {
    setSelectedVideo(video);
    setShowPreviewDialog(true);
  };

  const handleSendWarning = (videoId: string, userId: string, message: string) => {
    sendWarningMutation.mutate({ videoId, userId, message });
  };

  const handleRestrictUser = (userId: string, reason: string) => {
    restrictUserMutation.mutate({ userId, reason, duration: "30days" });
  };

  const handleViewUserProfile = (userId: string) => {
    AdminService.getUser(userId).then(userData => {
      setUserDetailsDialog({
        open: true,
        user: userData
      });
    });
  };

  const handleSelectVideo = (videoId: string, selected: boolean) => {
    if (selected) {
      setSelectedVideos(prev => [...prev, videoId]);
    } else {
      setSelectedVideos(prev => prev.filter(id => id !== videoId));
    }
  };

  const handleSelectAllVideos = (selected: boolean) => {
    if (selected) {
      setSelectedVideos(data?.data.map(video => video.id) || []);
    } else {
      setSelectedVideos([]);
    }
  };

  const handleBatchAction = () => {
    switch (batchActionDialog.type) {
      case 'approve':
        updateStatusMutation.mutate({ videoIds: selectedVideos, status: 'active' });
        break;
      case 'flag':
        updateStatusMutation.mutate({ videoIds: selectedVideos, status: 'flagged' });
        break;
      case 'remove':
        updateStatusMutation.mutate({ videoIds: selectedVideos, status: 'removed' });
        break;
      case 'delete':
        deleteVideoMutation.mutate(selectedVideos);
        break;
    }
    setBatchActionDialog({ open: false, type: 'approve' });
    setBatchActionReason('');
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setUserFilter('');
    setDateFilter(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
        <h2 className="text-2xl font-bold">Manage Videos</h2>
        <VideosFilter 
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          userFilter={userFilter}
          onUserFilterChange={setUserFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          onResetFilters={resetFilters}
        />
      </div>

      {selectedVideos.length > 0 && (
        <div className="bg-muted p-4 rounded-md flex justify-between items-center">
          <span>{selectedVideos.length} videos selected</span>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="text-green-600"
              onClick={() => setBatchActionDialog({ open: true, type: 'approve' })}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve All
            </Button>
            <Button 
              variant="outline" 
              className="text-yellow-600"
              onClick={() => setBatchActionDialog({ open: true, type: 'flag' })}
            >
              <Flag className="mr-2 h-4 w-4" />
              Flag All
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600"
              onClick={() => setBatchActionDialog({ open: true, type: 'remove' })}
            >
              <Ban className="mr-2 h-4 w-4" />
              Remove All
            </Button>
            <Button 
              variant="outline" 
              className="text-red-600"
              onClick={() => setBatchActionDialog({ open: true, type: 'delete' })}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All
            </Button>
          </div>
        </div>
      )}

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
            onViewUserProfile={handleViewUserProfile}
            onSendWarning={handleSendWarning}
            onRestrictUser={handleRestrictUser}
            selectedVideos={selectedVideos}
            onSelectVideo={handleSelectVideo}
            onSelectAllVideos={handleSelectAllVideos}
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

      <Dialog 
        open={batchActionDialog.open} 
        onOpenChange={(open) => setBatchActionDialog({ ...batchActionDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {batchActionDialog.type === 'approve' && 'Approve Selected Videos'}
              {batchActionDialog.type === 'flag' && 'Flag Selected Videos'}
              {batchActionDialog.type === 'remove' && 'Remove Selected Videos'}
              {batchActionDialog.type === 'delete' && 'Delete Selected Videos'}
            </DialogTitle>
            <DialogDescription>
              {batchActionDialog.type === 'delete' 
                ? 'This action cannot be undone. Are you sure you want to delete these videos?'
                : `Are you sure you want to ${batchActionDialog.type} the selected videos?`}
            </DialogDescription>
          </DialogHeader>
          
          {(batchActionDialog.type === 'warn' || batchActionDialog.type === 'restrict') && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason..."
                  value={batchActionReason}
                  onChange={(e) => setBatchActionReason(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBatchActionDialog({ open: false, type: 'approve' })}
            >
              Cancel
            </Button>
            <Button
              variant={batchActionDialog.type === 'delete' ? 'destructive' : 'default'}
              onClick={handleBatchAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={userDetailsDialog.open} 
        onOpenChange={(open) => setUserDetailsDialog({ ...userDetailsDialog, open })}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          
          {userLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : userDetailsDialog.user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium">User Information</h3>
                <div className="mt-2 space-y-2">
                  <p><strong>Username:</strong> {userDetailsDialog.user.username}</p>
                  <p><strong>Email:</strong> {userDetailsDialog.user.email}</p>
                  <p><strong>Status:</strong> {userDetailsDialog.user.status}</p>
                  <p><strong>Role:</strong> {userDetailsDialog.user.role}</p>
                  <p><strong>Joined:</strong> {new Date(userDetailsDialog.user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Activity</h3>
                <div className="mt-2 space-y-2">
                  <p><strong>Videos:</strong> {userDetailsDialog.user.videoCount}</p>
                  <p><strong>Orders:</strong> {userDetailsDialog.user.ordersCount}</p>
                </div>
                <div className="mt-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-yellow-600"
                    onClick={() => {
                      setUserDetailsDialog({ open: false, user: null });
                      if (userDetailsDialog.user) {
                        setUserFilter(userDetailsDialog.user.username);
                      }
                    }}
                  >
                    View User's Videos
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600"
                    onClick={() => {
                      if (userDetailsDialog.user) {
                        setBatchActionDialog({ open: true, type: 'restrict' });
                        setUserDetailsDialog({ open: false, user: null });
                      }
                    }}
                  >
                    Restrict User
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p>No user data available</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVideos;
