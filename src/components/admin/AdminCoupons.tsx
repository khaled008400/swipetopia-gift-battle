
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminCoupon } from '@/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Search, X, Edit, Trash2 } from 'lucide-react';
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

const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().min(0.01, "Value must be greater than 0"),
  minimum_purchase: z.number().min(0).optional(),
  expiry_date: z.string().refine(date => !isNaN(Date.parse(date)), "Invalid date format"),
  usage_limit: z.number().int().min(0).optional(),
  is_active: z.boolean()
});

type CouponFormData = z.infer<typeof couponSchema>;

const AdminCoupons = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedCoupon, setSelectedCoupon] = useState<AdminCoupon | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminCoupons', page, search],
    queryFn: () => AdminService.getCoupons(page, search)
  });

  const createCouponMutation = useMutation({
    mutationFn: (couponData: CouponFormData) => {
      return AdminService.createCoupon({
        ...couponData,
        applicable_products: [],
        applicable_categories: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      setShowCouponDialog(false);
      toast({
        title: "Coupon created",
        description: "Coupon has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create coupon.",
        variant: "destructive"
      });
    }
  });

  const updateCouponMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: CouponFormData }) => {
      return AdminService.updateCoupon(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      setShowCouponDialog(false);
      toast({
        title: "Coupon updated",
        description: "Coupon has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update coupon.",
        variant: "destructive"
      });
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: (couponId: string) => AdminService.deleteCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      toast({
        title: "Coupon deleted",
        description: "Coupon has been deleted successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete coupon.",
        variant: "destructive"
      });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };

  const handleCreateCoupon = () => {
    setDialogMode('create');
    setSelectedCoupon(null);
    setShowCouponDialog(true);
  };

  const handleEditCoupon = (coupon: AdminCoupon) => {
    setSelectedCoupon(coupon);
    setDialogMode('edit');
    setShowCouponDialog(true);
  };

  const handleDeleteCoupon = (couponId: string) => {
    if (confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) {
      deleteCouponMutation.mutate(couponId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Coupons</h2>
        <Button onClick={handleCreateCoupon}>
          <Plus className="mr-2 h-4 w-4" /> Create Coupon
        </Button>
      </div>

      <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Search coupon codes..."
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
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Min. Purchase</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Used/Limit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-medium">{coupon.code}</TableCell>
                    <TableCell>
                      {coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </TableCell>
                    <TableCell>
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
                    </TableCell>
                    <TableCell>
                      {coupon.minimum_purchase ? `$${coupon.minimum_purchase.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(coupon.expiry_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {coupon.usage_count}/{coupon.usage_limit || '∞'}
                    </TableCell>
                    <TableCell>
                      <Badge className={coupon.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditCoupon(coupon)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {data?.data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No coupons found
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

      <CouponFormDialog
        open={showCouponDialog}
        onOpenChange={setShowCouponDialog}
        mode={dialogMode}
        initialData={selectedCoupon}
        onSubmit={(data) => {
          if (dialogMode === 'create') {
            createCouponMutation.mutate(data);
          } else if (selectedCoupon) {
            updateCouponMutation.mutate({ id: selectedCoupon.id, data });
          }
        }}
      />
    </div>
  );
};

interface CouponFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData: AdminCoupon | null;
  onSubmit: (data: CouponFormData) => void;
}

const CouponFormDialog = ({ 
  open, 
  onOpenChange, 
  mode, 
  initialData, 
  onSubmit 
}: CouponFormDialogProps) => {
  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: initialData ? {
      code: initialData.code,
      type: initialData.type,
      value: initialData.value,
      minimum_purchase: initialData.minimum_purchase || 0,
      expiry_date: initialData.expiry_date,
      usage_limit: initialData.usage_limit || 0,
      is_active: initialData.is_active
    } : {
      code: '',
      type: 'percentage',
      value: 0,
      minimum_purchase: 0,
      expiry_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], // 30 days from now
      usage_limit: 0,
      is_active: true
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Coupon' : 'Edit Coupon'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="SUMMER25" autoCapitalize="characters" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
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
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step={field.value === 'percentage' ? '1' : '0.01'}
                        min="0"
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                name="minimum_purchase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Purchase ($)</FormLabel>
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

              <FormField
                control={form.control}
                name="usage_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Limit (0 = unlimited)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
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

            <FormField
              control={form.control}
              name="expiry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {mode === 'create' ? 'Create Coupon' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCoupons;
