
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminOffer } from '@/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Search, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

const offerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  type: z.enum(["percentage", "fixed", "buy_x_get_y", "bundle"]),
  value: z.number().min(0, "Value must be at least 0"),
  start_date: z.string().refine(date => !isNaN(Date.parse(date)), "Invalid date format"),
  end_date: z.string().refine(date => !isNaN(Date.parse(date)), "Invalid date format"),
  is_active: z.boolean(),
  rules: z.object({
    buy_quantity: z.number().int().min(0).optional(),
    get_quantity: z.number().int().min(0).optional(),
    bundle_products: z.array(z.string()).optional(),
    bundle_price: z.number().min(0).optional()
  }).optional()
});

type OfferFormData = z.infer<typeof offerSchema>;

const AdminOffers = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedOffer, setSelectedOffer] = useState<AdminOffer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminOffers', page, search],
    queryFn: () => AdminService.getOffers(page, search)
  });

  const createOfferMutation = useMutation({
    mutationFn: (offerData: OfferFormData) => {
      return AdminService.createOffer({
        ...offerData,
        applicable_products: [],
        applicable_categories: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOffers'] });
      setShowOfferDialog(false);
      toast({
        title: "Offer created",
        description: "Offer has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create offer.",
        variant: "destructive"
      });
    }
  });

  const updateOfferMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: OfferFormData }) => {
      return AdminService.updateOffer(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOffers'] });
      setShowOfferDialog(false);
      toast({
        title: "Offer updated",
        description: "Offer has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update offer.",
        variant: "destructive"
      });
    }
  });

  const deleteOfferMutation = useMutation({
    mutationFn: (offerId: string) => AdminService.deleteOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOffers'] });
      toast({
        title: "Offer deleted",
        description: "Offer has been deleted successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete offer.",
        variant: "destructive"
      });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const handleCreateOffer = () => {
    setDialogMode('create');
    setSelectedOffer(null);
    setShowOfferDialog(true);
  };

  const handleEditOffer = (offer: AdminOffer) => {
    setSelectedOffer(offer);
    setDialogMode('edit');
    setShowOfferDialog(true);
  };

  const handleDeleteOffer = (offerId: string) => {
    if (confirm("Are you sure you want to delete this offer? This action cannot be undone.")) {
      deleteOfferMutation.mutate(offerId);
    }
  };

  const getOfferTypeDisplay = (type: string) => {
    switch (type) {
      case 'percentage': return 'Percentage Discount';
      case 'fixed': return 'Fixed Amount';
      case 'buy_x_get_y': return 'Buy X Get Y';
      case 'bundle': return 'Bundle Deal';
      default: return type;
    }
  };

  const getOfferValueDisplay = (offer: AdminOffer) => {
    if (offer.type === 'percentage') {
      return `${offer.value}% off`;
    } else if (offer.type === 'fixed') {
      return `$${offer.value.toFixed(2)} off`;
    } else if (offer.type === 'buy_x_get_y') {
      return offer.rules?.buy_quantity && offer.rules?.get_quantity 
        ? `Buy ${offer.rules.buy_quantity} get ${offer.rules.get_quantity}`
        : 'Special offer';
    } else if (offer.type === 'bundle') {
      return offer.rules?.bundle_price 
        ? `Bundle for $${offer.rules.bundle_price.toFixed(2)}`
        : 'Bundle deal';
    }
    return '-';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Offers & Promotions</h2>
        <Button onClick={handleCreateOffer}>
          <Plus className="mr-2 h-4 w-4" /> Create Offer
        </Button>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Search offers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{offer.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-xs">
                          {offer.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getOfferTypeDisplay(offer.type)}
                    </TableCell>
                    <TableCell>
                      {getOfferValueDisplay(offer)}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div>Start: {format(new Date(offer.start_date), 'MMM dd, yyyy')}</div>
                        <div>End: {format(new Date(offer.end_date), 'MMM dd, yyyy')}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={offer.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                        {offer.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditOffer(offer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteOffer(offer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {data?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No offers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {data?.pagination && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.pagination.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= data.pagination.last_page}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <OfferFormDialog
        open={showOfferDialog}
        onOpenChange={setShowOfferDialog}
        mode={dialogMode}
        initialData={selectedOffer}
        onSubmit={(data) => {
          if (dialogMode === 'create') {
            createOfferMutation.mutate(data);
          } else if (selectedOffer) {
            updateOfferMutation.mutate({ id: selectedOffer.id, data });
          }
        }}
      />
    </div>
  );
};

interface OfferFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData: AdminOffer | null;
  onSubmit: (data: OfferFormData) => void;
}

const OfferFormDialog = ({ 
  open, 
  onOpenChange, 
  mode, 
  initialData, 
  onSubmit 
}: OfferFormDialogProps) => {
  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      type: initialData.type,
      value: initialData.value,
      start_date: initialData.start_date.split('T')[0],
      end_date: initialData.end_date.split('T')[0],
      is_active: initialData.is_active,
      rules: initialData.rules || {
        buy_quantity: 0,
        get_quantity: 0,
        bundle_products: [],
        bundle_price: 0
      }
    } : {
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], // 30 days from now
      is_active: true,
      rules: {
        buy_quantity: 0,
        get_quantity: 0,
        bundle_products: [],
        bundle_price: 0
      }
    }
  });

  const offerType = form.watch('type');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Offer' : 'Edit Offer'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Summer Sale" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Get discount on summer items" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Type</FormLabel>
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Discount</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Discount</SelectItem>
                      <SelectItem value="buy_x_get_y">Buy X Get Y Free</SelectItem>
                      <SelectItem value="bundle">Bundle Deal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Different fields based on offer type */}
            {(offerType === 'percentage' || offerType === 'fixed') && (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {offerType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step={offerType === 'percentage' ? '1' : '0.01'}
                        min="0"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {offerType === 'buy_x_get_y' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rules.buy_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buy Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          step="1"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value || 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rules.get_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Get Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1"
                          step="1"
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value || 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {offerType === 'bundle' && (
              <FormField
                control={form.control}
                name="rules.bundle_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bundle Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        min="0"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Active</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {mode === 'create' ? 'Create Offer' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOffers;
