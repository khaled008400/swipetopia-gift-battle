
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { VirtualGift } from '@/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GiftForm from './GiftForm';
import GiftsTable from './GiftsTable';
import GiftFilters from './GiftFilters';

const VirtualGifts = () => {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [selectedGift, setSelectedGift] = useState<VirtualGift | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['virtualGifts', page, categoryFilter],
    queryFn: () => AdminService.getVirtualGifts(page, 10, categoryFilter),
  });

  const createGiftMutation = useMutation({
    mutationFn: (giftData: Omit<VirtualGift, 'id' | 'createdAt' | 'updatedAt'>) => 
      AdminService.createVirtualGift(giftData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      setShowGiftDialog(false);
      toast({
        title: "Gift created",
        description: "Virtual gift has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create virtual gift.",
        variant: "destructive",
      });
    },
  });

  const updateGiftMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<VirtualGift, 'id' | 'createdAt' | 'updatedAt'>> }) => 
      AdminService.updateVirtualGift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      setShowGiftDialog(false);
      toast({
        title: "Gift updated",
        description: "Virtual gift has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update virtual gift.",
        variant: "destructive",
      });
    },
  });

  const deleteGiftMutation = useMutation({
    mutationFn: (giftId: string) => AdminService.deleteVirtualGift(giftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      toast({
        title: "Gift deleted",
        description: "Virtual gift has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete virtual gift.",
        variant: "destructive",
      });
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, available }: { id: string, available: boolean }) => 
      AdminService.toggleGiftAvailability(id, available),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      toast({
        title: "Availability updated",
        description: "Gift availability has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update gift availability.",
        variant: "destructive",
      });
    },
  });

  const handleCreateGift = () => {
    setDialogMode('create');
    setSelectedGift(null);
    setShowGiftDialog(true);
  };

  const handleEditGift = (gift: VirtualGift) => {
    setSelectedGift(gift);
    setDialogMode('edit');
    setShowGiftDialog(true);
  };

  const handleDeleteGift = (giftId: string) => {
    if (confirm("Are you sure you want to delete this gift? This action cannot be undone.")) {
      deleteGiftMutation.mutate(giftId);
    }
  };

  const handleToggleAvailability = (gift: VirtualGift) => {
    toggleAvailabilityMutation.mutate({ id: gift.id, available: !gift.available });
  };

  const handleFormSubmit = (data: Omit<VirtualGift, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (dialogMode === 'create') {
      createGiftMutation.mutate(data);
    } else if (dialogMode === 'edit' && selectedGift) {
      updateGiftMutation.mutate({ id: selectedGift.id, data });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Virtual Gifts</h2>
        <Button onClick={handleCreateGift} className="bg-app-yellow text-app-black hover:bg-app-yellow/80">
          <Plus className="mr-2 h-4 w-4" /> Add New Gift
        </Button>
      </div>

      <GiftFilters 
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <GiftsTable
          gifts={data?.data || []}
          onEdit={handleEditGift}
          onDelete={handleDeleteGift}
          onToggleAvailability={handleToggleAvailability}
        />
      )}

      <Dialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Add New Virtual Gift' : 'Edit Virtual Gift'}
            </DialogTitle>
          </DialogHeader>
          
          <GiftForm
            initialData={selectedGift}
            onSubmit={handleFormSubmit}
            mode={dialogMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VirtualGifts;
