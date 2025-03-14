import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminService, { ProductAttribute } from '@/services/admin.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash, Pencil, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProductAttributesProps {
  // Define any props here
}

const ProductAttributes = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAttribute, setCurrentAttribute] = useState<ProductAttribute | null>(null);
  
  const [attributeName, setAttributeName] = useState('');
  const [attributeValues, setAttributeValues] = useState('');

  const queryClient = useQueryClient();

  const resetForm = () => {
    setAttributeName('');
    setAttributeValues('');
    setCurrentAttribute(null);
    setIsEditing(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setOpen(open);
  };

  // Fetch attributes
  const { data: attributes, isLoading } = useQuery({
    queryKey: ['productAttributes'],
    queryFn: () => AdminService.getProductAttributes(),
  });

  // Add attribute mutation
  const addAttributeMutation = useMutation({
    mutationFn: (attribute: Omit<ProductAttribute, 'id'>) => AdminService.createProductAttribute(attribute),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAttributes'] });
      resetForm();
      setOpen(false);
      toast({
        title: "Success",
        description: "Attribute created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create attribute",
        variant: "destructive",
      });
      console.error("Create attribute error:", error);
    }
  });

  // Update attribute mutation
  const updateAttributeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<ProductAttribute, 'id'>> }) => 
      AdminService.updateProductAttribute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAttributes'] });
      resetForm();
      setOpen(false);
      toast({
        title: "Success",
        description: "Attribute updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update attribute",
        variant: "destructive",
      });
      console.error("Update attribute error:", error);
    }
  });

  // Delete attribute mutation
  const deleteAttributeMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteProductAttribute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productAttributes'] });
      toast({
        title: "Success",
        description: "Attribute deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete attribute",
        variant: "destructive",
      });
      console.error("Delete attribute error:", error);
    }
  });

  const handleEditAttribute = (attribute: ProductAttribute) => {
    setCurrentAttribute(attribute);
    setAttributeName(attribute.name);
    setAttributeValues(attribute.values.join(', '));
    setIsEditing(true);
    setOpen(true);
  };

  const handleSubmit = () => {
    // Validate form
    if (!attributeName || !attributeValues) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Convert comma-separated string to array of values
    const values = attributeValues.split(',').map(value => value.trim()).filter(value => value);

    const attributeData = {
      name: attributeName,
      values,
      color: '#' + Math.floor(Math.random()*16777215).toString(16) // Generate random color
    };

    if (isEditing && currentAttribute) {
      updateAttributeMutation.mutate({
        id: currentAttribute.id,
        data: attributeData
      });
    } else {
      addAttributeMutation.mutate(attributeData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Attributes</h2>
          <p className="text-muted-foreground">Manage attributes for your products</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditing(false)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Attribute
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Attribute' : 'Add Attribute'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update existing attribute details' : 'Add a new attribute to your store'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Attribute Name</Label>
                <Input
                  id="name"
                  value={attributeName}
                  onChange={(e) => setAttributeName(e.target.value)}
                  placeholder="Size"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="values">Attribute Values (comma-separated)</Label>
                <Input
                  id="values"
                  value={attributeValues}
                  onChange={(e) => setAttributeValues(e.target.value)}
                  placeholder="Small, Medium, Large"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>
                {isEditing ? 'Update' : 'Add'} Attribute
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {attributes && attributes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Values</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attributes.map((attribute) => (
                  <TableRow key={attribute.id}>
                    <TableCell className="font-medium">{attribute.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {attribute.values.map((value, index) => (
                          <Badge key={index} variant="outline">{value}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditAttribute(attribute)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${attribute.name}?`)) {
                              deleteAttributeMutation.mutate(attribute.id);
                            }
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No attributes found. Create your first attribute to get started.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductAttributes;
