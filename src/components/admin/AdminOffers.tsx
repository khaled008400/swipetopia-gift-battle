import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminOffer } from '@/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Edit, Trash2, Tag, BarChart, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { format } from 'date-fns';

// Define the form schema for offers
const offerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  discount_type: z.enum(['percentage', 'fixed', 'special']),
  discount_value: z.number().min(0, "Discount value cannot be negative"),
  discount_percentage: z.number().min(0, "Discount percentage cannot be negative"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  min_purchase_amount: z.number().optional(),
  product_category: z.string().optional(),
  product_id: z.string().optional(),
  active: z.boolean().default(true)
});

type OfferFormValues = z.infer<typeof offerSchema>;

const AdminOffers: React.FC = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [offerDialog, setOfferDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedOffer, setSelectedOffer] = useState<AdminOffer | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch offers data
  const { data, isLoading } = useQuery({
    queryKey: ['adminOffers'],
    queryFn: () => AdminService.getOffers(),
  });

  // Fetch offer analytics
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['offerAnalytics'],
    queryFn: () => AdminService.getOfferAnalytics(),
    enabled: showAnalytics
  });

  // Create offer mutation
  const createOfferMutation = useMutation({
    mutationFn: (offerData: Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>) => 
      AdminService.createOffer(offerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOffers'] });
      queryClient.invalidateQueries({ queryKey: ['offerAnalytics'] });
      setOfferDialog(false);
      toast({
        title: "Offer created",
        description: "Special offer has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create special offer.",
        variant: "destructive"
      });
    }
  });

  // Update offer mutation
  const updateOfferMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>> }) => 
      AdminService.updateOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOffers'] });
      queryClient.invalidateQueries({ queryKey: ['offerAnalytics'] });
      setOfferDialog(false);
      toast({
        title: "Offer updated",
        description: "Special offer has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update special offer.",
        variant: "destructive"
      });
    }
  });

  // Delete offer mutation
  const deleteOfferMutation = useMutation({
    mutationFn: (offerId: string) => AdminService.deleteOffer(offerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOffers'] });
      queryClient.invalidateQueries({ queryKey: ['offerAnalytics'] });
      toast({
        title: "Offer deleted",
        description: "Special offer has been deleted successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete special offer.",
        variant: "destructive"
      });
    }
  });

  // Form setup
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      name: '',
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      discount_percentage: 0,
      start_date: '',
      end_date: '',
      min_purchase_amount: 0,
      product_category: '',
      product_id: '',
      active: true
    }
  });

  // Handle dialog open
  const handleCreateOffer = () => {
    form.reset({
      name: '',
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      discount_percentage: 0,
      start_date: '',
      end_date: '',
      min_purchase_amount: 0,
      product_category: '',
      product_id: '',
      active: true
    });
    setDialogMode('create');
    setSelectedOffer(null);
    setOfferDialog(true);
  };

  // Handle edit offer
  const handleEditOffer = (offer: AdminOffer) => {
    form.reset({
      name: offer.name,
      title: offer.title,
      description: offer.description,
      discount_type: offer.discount_type,
      discount_value: offer.discount_value,
      discount_percentage: offer.discount_percentage,
      start_date: offer.start_date || '',
      end_date: offer.end_date || '',
      min_purchase_amount: offer.min_purchase_amount || 0,
      product_category: offer.product_category || '',
      product_id: offer.product_id || '',
      active: offer.active || true
    });
    setDialogMode('edit');
    setSelectedOffer(offer);
    setOfferDialog(true);
  };

  // Handle delete offer
  const handleDeleteOffer = (offerId: string) => {
    if (confirm("Are you sure you want to delete this offer? This action cannot be undone.")) {
      deleteOfferMutation.mutate(offerId);
    }
  };

  // Handle form submission
  const onSubmit = (formData: OfferFormValues) => {
    const discountPercentage = formData.discount_type === 'percentage' ? formData.discount_value : 0;
    
    const offerData = {
      name: formData.name,
      title: formData.title,
      description: formData.description,
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      discount_percentage: discountPercentage,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
      min_purchase_amount: formData.min_purchase_amount || undefined,
      product_category: formData.product_category || undefined,
      product_id: formData.product_id || '',
      active: formData.active
    };
    
    if (dialogMode === 'create') {
      createOfferMutation.mutate(offerData);
    } else if (dialogMode === 'edit' && selectedOffer) {
      updateOfferMutation.mutate({
        id: selectedOffer.id,
        data: offerData
      });
    }
  };

  const formatDiscountValue = (type: string, value: number) => {
    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'fixed':
        return `$${value.toFixed(2)}`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Special Offers</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowAnalytics(!showAnalytics)}>
            <BarChart className="h-4 w-4 mr-2" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </Button>
          <Button onClick={handleCreateOffer}>
            <Plus className="h-4 w-4 mr-2" /> Add Offer
          </Button>
        </div>
      </div>
      
      {showAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {isAnalyticsLoading ? (
            <div className="col-span-3 flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue from Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analyticsData?.totalRevenue.toFixed(2)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Offer Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analyticsData?.conversionRate}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analyticsData?.averageOrderValue.toFixed(2)}</div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Performing Offers</CardTitle>
                  <CardDescription>Offers with the highest conversion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Offer</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Conversion Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyticsData?.topOffers.map((offer: any) => (
                        <TableRow key={offer.id}>
                          <TableCell className="font-medium">{offer.name}</TableCell>
                          <TableCell>{offer.orders}</TableCell>
                          <TableCell>${offer.revenue.toFixed(2)}</TableCell>
                          <TableCell>{offer.conversionRate}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((offer: AdminOffer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-medium">{offer.name}</TableCell>
                <TableCell>
                  {formatDiscountValue(offer.discount_type, offer.discount_value)}
                </TableCell>
                <TableCell className="max-w-xs truncate">{offer.description}</TableCell>
                <TableCell>
                  {offer.start_date && offer.end_date ? (
                    `${format(new Date(offer.start_date), 'MMM d')} - ${format(new Date(offer.end_date), 'MMM d, yyyy')}`
                  ) : 'Ongoing'}
                </TableCell>
                <TableCell>
                  <Badge className={offer.active ? 'bg-green-500' : 'bg-gray-500'}>
                    {offer.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditOffer(offer)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleDeleteOffer(offer.id)}
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
      )}

      <Dialog open={offerDialog} onOpenChange={setOfferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Add New Offer' : 'Edit Offer'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Summer Sale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Summer Sale Title" {...field} />
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
                      <Textarea placeholder="e.g. Get discounts on summer items" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="discount_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type</FormLabel>
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
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="special">Special Deal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discount_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Value</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
                name="min_purchase_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Purchase Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value || 0}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave at zero for no minimum
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="product_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <Select 
                      value={field.value || ''} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="digital">Digital</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Leave empty to apply to all products
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. prod_123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" variant="default">
                  {dialogMode === 'create' ? 'Create' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOffers;
