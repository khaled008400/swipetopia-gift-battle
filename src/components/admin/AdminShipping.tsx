
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminShippingMethod } from '@/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Edit, Trash2, Ship, MoreHorizontal } from 'lucide-react';
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

// Define the form schema for shipping methods
const shippingMethodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  estimated_days: z.string().min(1, "Estimated delivery time is required"),
  is_active: z.boolean().default(true)
});

type ShippingMethodFormValues = z.infer<typeof shippingMethodSchema>;

const AdminShipping: React.FC = () => {
  const [methodDialog, setMethodDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedMethod, setSelectedMethod] = useState<AdminShippingMethod | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch shipping methods
  const { data, isLoading } = useQuery({
    queryKey: ['shippingMethods'],
    queryFn: () => AdminService.getShippingMethods(),
  });

  // Create shipping method mutation
  const createMethodMutation = useMutation({
    mutationFn: (methodData: Omit<AdminShippingMethod, 'id'>) => 
      AdminService.createShippingMethod(methodData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingMethods'] });
      setMethodDialog(false);
      toast({
        title: "Shipping method created",
        description: "Shipping method has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create shipping method.",
        variant: "destructive"
      });
    }
  });

  // Update shipping method mutation
  const updateMethodMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<AdminShippingMethod, 'id'>> }) => 
      AdminService.updateShippingMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingMethods'] });
      setMethodDialog(false);
      toast({
        title: "Shipping method updated",
        description: "Shipping method has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update shipping method.",
        variant: "destructive"
      });
    }
  });

  // Delete shipping method mutation
  const deleteMethodMutation = useMutation({
    mutationFn: (methodId: string) => AdminService.deleteShippingMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shippingMethods'] });
      toast({
        title: "Shipping method deleted",
        description: "Shipping method has been deleted successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete shipping method.",
        variant: "destructive"
      });
    }
  });

  // Form setup
  const form = useForm<ShippingMethodFormValues>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      estimated_days: '',
      is_active: true
    }
  });

  // Handle dialog open
  const handleCreateMethod = () => {
    form.reset({
      name: '',
      description: '',
      price: 0,
      estimated_days: '',
      is_active: true
    });
    setDialogMode('create');
    setSelectedMethod(null);
    setMethodDialog(true);
  };

  // Handle edit method
  const handleEditMethod = (method: AdminShippingMethod) => {
    form.reset({
      name: method.name,
      description: method.description,
      price: method.price,
      estimated_days: method.estimated_days,
      is_active: method.is_active ?? true
    });
    setDialogMode('edit');
    setSelectedMethod(method);
    setMethodDialog(true);
  };

  // Handle delete method
  const handleDeleteMethod = (methodId: string) => {
    if (confirm("Are you sure you want to delete this shipping method? This action cannot be undone.")) {
      deleteMethodMutation.mutate(methodId);
    }
  };

  // Handle form submission
  const onSubmit = (formData: ShippingMethodFormValues) => {
    if (dialogMode === 'create') {
      // Ensure all required fields are provided for create operation
      createMethodMutation.mutate({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        estimated_days: formData.estimated_days,
        is_active: formData.is_active
      });
    } else if (dialogMode === 'edit' && selectedMethod) {
      updateMethodMutation.mutate({
        id: selectedMethod.id,
        data: formData
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Shipping Methods</h2>
        <Button onClick={handleCreateMethod}>
          <Plus className="h-4 w-4 mr-2" /> Add Shipping Method
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Delivery Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((method: AdminShippingMethod) => (
              <TableRow key={method.id}>
                <TableCell className="font-medium">{method.name}</TableCell>
                <TableCell>{method.description}</TableCell>
                <TableCell>${method.price.toFixed(2)}</TableCell>
                <TableCell>{method.estimated_days}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditMethod(method)}>
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
                          onClick={() => handleDeleteMethod(method.id)}
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

      {/* Shipping Method Form Dialog */}
      <Dialog open={methodDialog} onOpenChange={setMethodDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Add New Shipping Method' : 'Edit Shipping Method'}
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
                      <Input placeholder="e.g. Standard Shipping" {...field} />
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
                      <Textarea placeholder="e.g. Regular mail delivery" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
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
              
              <FormField
                control={form.control}
                name="estimated_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Delivery Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3-5 business days" {...field} />
                    </FormControl>
                    <FormDescription>
                      Format as a range or specific number of days
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">
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

export default AdminShipping;
