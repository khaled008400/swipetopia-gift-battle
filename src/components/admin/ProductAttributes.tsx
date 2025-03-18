import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { ProductAttribute } from '@/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Edit, Trash2, Tag, MoreHorizontal } from 'lucide-react';
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
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Pagination } from '@/components/ui/pagination';

// Define the form schema for product attributes
const attributeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  values: z.string().min(2, "Values must be at least 2 characters"),
  color: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

type AttributeFormValues = z.infer<typeof attributeSchema>;

const ProductAttributes: React.FC = () => {
  const [page, setPage] = useState(1);
  const [attributeDialog, setAttributeDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedAttribute, setSelectedAttribute] = useState<ProductAttribute | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch attributes data - fixed to not pass any arguments to getProductAttributes
  const { data: attributesData, isLoading } = useQuery({
    queryKey: ['productAttributes', page],
    queryFn: () => AdminService.getProductAttributes()
  });

  // Create attribute mutation
  const createAttributeMutation = useMutation({
    mutationFn: (attributeData: Omit<ProductAttribute, 'id'>) => 
      AdminService.createProductAttribute(attributeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAttributes'] });
      setAttributeDialog(false);
      toast({
        title: "Attribute created",
        description: "Product attribute has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product attribute.",
        variant: "destructive"
      });
    }
  });

  // Update attribute mutation
  const updateAttributeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<ProductAttribute> }) => 
      AdminService.updateProductAttribute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAttributes'] });
      setAttributeDialog(false);
      toast({
        title: "Attribute updated",
        description: "Product attribute has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product attribute.",
        variant: "destructive"
      });
    }
  });

  // Delete attribute mutation
  const deleteAttributeMutation = useMutation({
    mutationFn: (attributeId: string) => AdminService.deleteProductAttribute(attributeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAttributes'] });
      toast({
        title: "Attribute deleted",
        description: "Product attribute has been deleted successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product attribute.",
        variant: "destructive"
      });
    }
  });

  // Form setup
  const form = useForm<AttributeFormValues>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      name: '',
      values: '',
      color: '',
      status: 'active'
    }
  });

  // Handle dialog open
  const handleCreateAttribute = () => {
    form.reset({
      name: '',
      values: '',
      color: '',
      status: 'active'
    });
    setDialogMode('create');
    setSelectedAttribute(null);
    setAttributeDialog(true);
  };

  // Handle edit attribute
  const handleEditAttribute = (attribute: ProductAttribute) => {
    form.reset({
      name: attribute.name,
      values: attribute.values.join(', '),
      color: attribute.color || '',
      status: attribute.status
    });
    setDialogMode('edit');
    setSelectedAttribute(attribute);
    setAttributeDialog(true);
  };

  // Handle delete attribute
  const handleDeleteAttribute = (attributeId: string) => {
    if (confirm("Are you sure you want to delete this attribute? This action cannot be undone.")) {
      deleteAttributeMutation.mutate(attributeId);
    }
  };

  // Handle form submission
  const onSubmit = (formData: AttributeFormValues) => {
    const values = formData.values.split(',').map(val => val.trim());
    
    if (dialogMode === 'create') {
      createAttributeMutation.mutate({
        name: formData.name,
        values,
        color: formData.color,
        status: formData.status,
        created_at: new Date().toISOString()
      });
    } else if (dialogMode === 'edit' && selectedAttribute) {
      updateAttributeMutation.mutate({
        id: selectedAttribute.id,
        data: {
          name: formData.name,
          values,
          color: formData.color,
          status: formData.status,
          created_at: selectedAttribute.created_at
        }
      });
    }
  };

  // Render pagination only if needed
  const renderPagination = () => {
    // Since the API doesn't return pagination info, we just show a simple prev/next
    return (
      <div className="flex justify-center mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <div className="mx-4 flex items-center">
          Page {page}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => p + 1)}
          disabled={attributesData && attributesData.length < 10} // Assume 10 per page
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Attributes</h2>
        <Button onClick={handleCreateAttribute}>
          <Plus className="h-4 w-4 mr-2" /> Add Attribute
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
              <TableHead>Values</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributesData && attributesData.map((attribute: ProductAttribute) => (
              <TableRow key={attribute.id}>
                <TableCell className="font-medium">{attribute.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {attribute.values.map((value, index) => (
                      <Badge key={index} className="bg-sidebar-accent">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {attribute.color && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: attribute.color }} />
                      <span>{attribute.color}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={attribute.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                    {attribute.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditAttribute(attribute)}>
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
                          onClick={() => handleDeleteAttribute(attribute.id)}
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

      {attributesData && attributesData.length > 0 && renderPagination()}

      <Dialog open={attributeDialog} onOpenChange={setAttributeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Add New Attribute' : 'Edit Attribute'}
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
                      <Input placeholder="e.g. Color, Size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="values"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Values (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Red, Green, Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Code (optional)</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="#9b87f5" {...field} />
                      </FormControl>
                      {field.value && (
                        <div 
                          className="w-10 h-10 rounded-md border" 
                          style={{ backgroundColor: field.value }}
                        />
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === 'active'}
                        onCheckedChange={(checked) => 
                          field.onChange(checked ? 'active' : 'inactive')
                        }
                      />
                    </FormControl>
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

export default ProductAttributes;
