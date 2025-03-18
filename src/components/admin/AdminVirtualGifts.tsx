import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService from '@/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import GiftsTable from './GiftsTable';
import GiftForm from './GiftForm';
import { VirtualGift } from '@/types/gift.types';

const AdminVirtualGifts = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [editingGift, setEditingGift] = useState<VirtualGift | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleCreateGift = (data: any) => {
    // Ensure all required fields are included
    const newGift = {
      ...data,
      value: parseInt(data.value || "0"),
      color: data.color || "#000000", 
      icon: data.icon || "gift",
      created_at: new Date().toISOString(),
      is_premium: data.is_premium || false
    };
    
    createGiftMutation.mutate(newGift);
  };

  const handleEditGift = (gift: VirtualGift) => {
    setEditingGift(gift);
    setShowDialog(true);
  };

  const handleDeleteGift = (giftId: string) => {
    if (confirm("Are you sure you want to delete this gift?")) {
      deleteGiftMutation.mutate(giftId);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingGift(null);
  };

  // Fix query usage
  const { data: gifts, isLoading } = useQuery({
    queryKey: ['virtualGifts'],
    queryFn: () => AdminService.getVirtualGifts()
  });

  const createGiftMutation = useMutation({
    mutationFn: (giftData: any) => AdminService.createVirtualGift(giftData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      toast({
        title: "Gift created",
        description: "Virtual gift has been created successfully."
      });
      handleCloseDialog();
    },
    onError: (error) => {
      console.error("Error creating gift:", error);
      toast({
        title: "Error",
        description: "Failed to create virtual gift.",
        variant: "destructive"
      });
    }
  });

  const updateGiftMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => 
      AdminService.updateVirtualGift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      toast({
        title: "Gift updated",
        description: "Virtual gift has been updated successfully."
      });
      handleCloseDialog();
    },
    onError: (error) => {
      console.error("Error updating gift:", error);
      toast({
        title: "Error",
        description: "Failed to update virtual gift.",
        variant: "destructive"
      });
    }
  });

  const deleteGiftMutation = useMutation({
    mutationFn: (giftId: string) => AdminService.deleteVirtualGift(giftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      toast({
        title: "Gift deleted",
        description: "Virtual gift has been deleted successfully."
      });
    },
    onError: (error) => {
      console.error("Error deleting gift:", error);
      toast({
        title: "Error",
        description: "Failed to delete virtual gift.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: any) => {
    if (editingGift) {
      updateGiftMutation.mutate({
        id: editingGift.id,
        data: {
          ...data,
          value: parseInt(data.value || "0")
        }
      });
    } else {
      handleCreateGift(data);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Virtual Gifts</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Gift
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : gifts && gifts.length > 0 ? (
        <GiftsTable 
          gifts={gifts} 
          onEdit={handleEditGift} 
          onDelete={handleDeleteGift} 
        />
      ) : (
        <div className="text-center p-12 border rounded-md">
          <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Virtual Gifts</h3>
          <p className="text-muted-foreground mb-4">
            You haven't created any virtual gifts yet. Create your first gift to get started.
          </p>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create First Gift
          </Button>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGift ? 'Edit Virtual Gift' : 'Create Virtual Gift'}
            </DialogTitle>
          </DialogHeader>
          <GiftForm 
            initialData={editingGift} 
            onSubmit={handleSubmit} 
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVirtualGifts;
