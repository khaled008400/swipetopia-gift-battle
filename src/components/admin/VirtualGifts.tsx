
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GiftForm from './GiftForm';
import GiftsTable from './GiftsTable';
import GiftFilters from './GiftFilters';
import { supabase } from '@/integrations/supabase/client';

export interface VirtualGift {
  id: string;
  name: string;
  price: number;
  icon: string;
  color: string;
  value: number;
  available?: boolean;
  created_at?: string;
  updated_at?: string;
}

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
    queryFn: async () => {
      let query = supabase.from('gifts').select('*');
      
      // Apply category filter if present
      if (categoryFilter) {
        query = query.eq('color', categoryFilter);
      }
      
      // Apply pagination
      const from = (page - 1) * 10;
      const to = from + 9;
      query = query.range(from, to);
      
      const { data, error, count } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return {
        data: data,
        pagination: {
          page,
          pageSize: 10,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / 10)
        }
      };
    }
  });

  const createGiftMutation = useMutation({
    mutationFn: async (giftData: Omit<VirtualGift, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('gifts')
        .insert([giftData])
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      setShowGiftDialog(false);
      toast({
        title: "Gift created",
        description: "Virtual gift has been created successfully.",
      });
    },
    onError: (error) => {
      console.error("Error creating gift:", error);
      toast({
        title: "Error",
        description: "Failed to create virtual gift.",
        variant: "destructive",
      });
    },
  });

  const updateGiftMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Omit<VirtualGift, 'id' | 'created_at' | 'updated_at'>> }) => {
      const { data: updatedData, error } = await supabase
        .from('gifts')
        .update(data)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return updatedData[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      setShowGiftDialog(false);
      toast({
        title: "Gift updated",
        description: "Virtual gift has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating gift:", error);
      toast({
        title: "Error",
        description: "Failed to update virtual gift.",
        variant: "destructive",
      });
    },
  });

  const deleteGiftMutation = useMutation({
    mutationFn: async (giftId: string) => {
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', giftId);
        
      if (error) throw error;
      return giftId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      toast({
        title: "Gift deleted",
        description: "Virtual gift has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting gift:", error);
      toast({
        title: "Error",
        description: "Failed to delete virtual gift.",
        variant: "destructive",
      });
    },
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async ({ id, available }: { id: string, available: boolean }) => {
      const { data, error } = await supabase
        .from('gifts')
        .update({ available })
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      toast({
        title: "Availability updated",
        description: "Gift availability has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating availability:", error);
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
    toggleAvailabilityMutation.mutate({ 
      id: gift.id, 
      available: !gift.available 
    });
  };

  const handleFormSubmit = (data: Omit<VirtualGift, 'id' | 'created_at' | 'updated_at'>) => {
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
