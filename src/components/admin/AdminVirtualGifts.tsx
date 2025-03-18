
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import GiftsTable from './GiftsTable';
import GiftForm from './GiftForm';
import { VirtualGift } from '@/types/gift.types';
import { supabase } from '@/lib/supabase';

const AdminVirtualGifts = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [editingGift, setEditingGift] = useState<VirtualGift | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch gifts from Supabase
  const { data: gifts, isLoading } = useQuery({
    queryKey: ['virtualGifts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('virtual_gifts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching virtual gifts:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Create gift mutation
  const createGiftMutation = useMutation({
    mutationFn: async (giftData: any) => {
      const { data, error } = await supabase
        .from('virtual_gifts')
        .insert({
          name: giftData.name,
          description: giftData.description || '',
          price: giftData.price,
          value: giftData.price / 2, // Simple logic for value calculation
          icon: '🎁', // Default icon
          color: '#FF5733', // Default color
          category: giftData.category,
          image_url: giftData.imageUrl,
          image_type: giftData.imageType,
          has_sound: giftData.hasSound,
          is_premium: false, // Default to false for new gifts
          available: giftData.available
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
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

  // Update gift mutation
  const updateGiftMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      const { error } = await supabase
        .from('virtual_gifts')
        .update({
          name: data.name,
          description: data.description || '',
          price: data.price,
          category: data.category,
          image_url: data.imageUrl,
          image_type: data.imageType,
          has_sound: data.hasSound,
          available: data.available
        })
        .eq('id', id);
      
      if (error) throw error;
      return { id, ...data };
    },
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

  // Delete gift mutation
  const deleteGiftMutation = useMutation({
    mutationFn: async (giftId: string) => {
      const { error } = await supabase
        .from('virtual_gifts')
        .delete()
        .eq('id', giftId);
      
      if (error) throw error;
      return giftId;
    },
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

  const handleCreateGift = (data: any) => {
    createGiftMutation.mutate(data);
  };

  const handleEditGift = (gift: VirtualGift) => {
    // Map the Supabase gift object to the form structure
    const formattedGift = {
      ...gift,
      imageUrl: gift.image_url || '',
      imageType: gift.image_type || 'gif',
      hasSound: gift.has_sound || false,
      soundUrl: gift.soundUrl || '',
      isPremium: gift.is_premium || false
    };
    
    setEditingGift(formattedGift);
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

  const handleSubmit = (data: any) => {
    if (editingGift) {
      updateGiftMutation.mutate({
        id: editingGift.id,
        data
      });
    } else {
      handleCreateGift(data);
    }
  };

  // Map Supabase gift data to our component structure
  const formattedGifts = gifts?.map(gift => ({
    ...gift,
    imageUrl: gift.image_url,
    imageType: gift.image_type,
    hasSound: gift.has_sound,
    isPremium: gift.is_premium
  }));

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
      ) : formattedGifts && formattedGifts.length > 0 ? (
        <GiftsTable 
          gifts={formattedGifts} 
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
            mode={editingGift ? 'edit' : 'create'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVirtualGifts;
