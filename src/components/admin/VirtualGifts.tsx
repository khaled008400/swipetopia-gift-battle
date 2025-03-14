
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminService, { VirtualGift } from '@/services/admin.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import GiftsTable from './GiftsTable';
import GiftFilters from './GiftFilters';
import GiftForm from './GiftForm';
import { Plus, Filter, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const VirtualGifts = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGift, setCurrentGift] = useState<VirtualGift | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const queryClient = useQueryClient();
  
  // Fetch gifts
  const { data: gifts, isLoading } = useQuery({
    queryKey: ['virtualGifts'],
    queryFn: () => AdminService.getVirtualGifts(),
  });

  // Add gift mutation
  const addGiftMutation = useMutation({
    mutationFn: (gift: Omit<VirtualGift, 'id' | 'createdAt'>) => AdminService.createVirtualGift(gift),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      setOpen(false);
      toast({
        title: "Success",
        description: "Gift created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create gift",
        variant: "destructive",
      });
      console.error("Create gift error:", error);
    }
  });

  // Update gift mutation
  const updateGiftMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<VirtualGift, 'id' | 'createdAt'>> }) => 
      AdminService.updateVirtualGift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      setOpen(false);
      toast({
        title: "Success",
        description: "Gift updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update gift",
        variant: "destructive",
      });
      console.error("Update gift error:", error);
    }
  });

  // Delete gift mutation
  const deleteGiftMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteVirtualGift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      toast({
        title: "Success",
        description: "Gift deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete gift",
        variant: "destructive",
      });
      console.error("Delete gift error:", error);
    }
  });

  // Toggle gift availability mutation
  const toggleGiftMutation = useMutation({
    mutationFn: ({ id, available }: { id: string, available: boolean }) => 
      AdminService.toggleGiftAvailability(id, available),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['virtualGifts'] });
      toast({
        title: "Success",
        description: "Gift availability updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update gift availability",
        variant: "destructive",
      });
      console.error("Toggle gift error:", error);
    }
  });

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setIsEditing(false);
      setCurrentGift(null);
    }
  };

  const handleToggleAvailability = (id: string, available: boolean) => {
    toggleGiftMutation.mutate({ id, available });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Virtual Gifts</h2>
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search gifts..."
            className="md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <GiftFilters 
            categoryFilter={categoryFilter} 
            onCategoryChange={setCategoryFilter} 
          />
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Gift
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Gift' : 'Add Gift'}</DialogTitle>
                <DialogDescription>
                  {isEditing ? 'Update existing gift details' : 'Add a new virtual gift to your store'}
                </DialogDescription>
              </DialogHeader>
              <GiftForm 
                initialData={currentGift}
                isEditing={isEditing}
                onSubmit={(data) => {
                  if (isEditing && currentGift) {
                    updateGiftMutation.mutate({ id: currentGift.id, data });
                  } else {
                    addGiftMutation.mutate(data as Omit<VirtualGift, 'id' | 'createdAt'>);
                  }
                }}
                onCancel={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {gifts && gifts.length > 0 ? (
            <GiftsTable 
              gifts={gifts}
              onEdit={(gift) => {
                setCurrentGift(gift);
                setIsEditing(true);
                setOpen(true);
              }}
              onDelete={(id) => {
                if (confirm('Are you sure you want to delete this gift?')) {
                  deleteGiftMutation.mutate(id);
                }
              }}
              onToggleAvailability={handleToggleAvailability}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No virtual gifts found. Create your first gift to get started.</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default VirtualGifts;
