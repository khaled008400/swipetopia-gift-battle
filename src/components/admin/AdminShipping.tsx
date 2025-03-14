
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShippingMethod } from '@/services/pricing.service';
import AdminService from '@/services/admin.service';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdminShipping = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentShipping, setCurrentShipping] = useState<ShippingMethod | null>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [minOrderValue, setMinOrderValue] = useState('');
  const [maxOrderValue, setMaxOrderValue] = useState('');
  const [applicableRegions, setApplicableRegions] = useState<string[]>([]);
  const [newRegion, setNewRegion] = useState('');

  const queryClient = useQueryClient();

  const { data: shippingMethods, isLoading } = useQuery({
    queryKey: ['adminShippingMethods'],
    queryFn: () => AdminService.getShippingMethods(),
  });

  const addMutation = useMutation({
    mutationFn: (shipping: Omit<ShippingMethod, 'id'>) => AdminService.createShippingMethod(shipping),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminShippingMethods'] });
      resetForm();
      setOpen(false);
      toast({
        title: "Success",
        description: "Shipping method created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create shipping method",
        variant: "destructive",
      });
      console.error("Create shipping method error:", error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (shipping: ShippingMethod) => AdminService.updateShippingMethod(shipping.id, shipping),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminShippingMethods'] });
      resetForm();
      setOpen(false);
      toast({
        title: "Success",
        description: "Shipping method updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update shipping method",
        variant: "destructive",
      });
      console.error("Update shipping method error:", error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteShippingMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminShippingMethods'] });
      toast({
        title: "Success",
        description: "Shipping method deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete shipping method",
        variant: "destructive",
      });
      console.error("Delete shipping method error:", error);
    }
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setEstimatedDays('');
    setIsActive(true);
    setMinOrderValue('');
    setMaxOrderValue('');
    setApplicableRegions([]);
    setNewRegion('');
    setCurrentShipping(null);
    setIsEditing(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setOpen(open);
  };

  const handleEditShipping = (shipping: ShippingMethod) => {
    setCurrentShipping(shipping);
    setName(shipping.name);
    setDescription(shipping.description);
    setPrice(shipping.price.toString());
    setEstimatedDays(shipping.estimated_days);
    setIsActive(shipping.is_active);
    
    // Set conditions if they exist
    if (shipping.conditions) {
      if (shipping.conditions.min_order_value) {
        setMinOrderValue(shipping.conditions.min_order_value.toString());
      }
      if (shipping.conditions.max_order_value) {
        setMaxOrderValue(shipping.conditions.max_order_value.toString());
      }
      if (shipping.conditions.applicable_regions) {
        setApplicableRegions(shipping.conditions.applicable_regions);
      }
    }
    
    setIsEditing(true);
    setOpen(true);
  };

  const handleAddRegion = () => {
    if (newRegion && !applicableRegions.includes(newRegion)) {
      setApplicableRegions([...applicableRegions, newRegion]);
      setNewRegion('');
    }
  };

  const handleRemoveRegion = (region: string) => {
    setApplicableRegions(applicableRegions.filter(r => r !== region));
  };

  const handleSubmit = () => {
    // Validate form
    if (!name || !description || !price || !estimatedDays) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const shippingData: any = {
      name,
      description,
      price: parseFloat(price),
      estimated_days: estimatedDays,
      is_active: isActive,
      conditions: {
        min_order_value: minOrderValue ? parseFloat(minOrderValue) : undefined,
        max_order_value: maxOrderValue ? parseFloat(maxOrderValue) : undefined,
        applicable_regions: applicableRegions.length > 0 ? applicableRegions : undefined,
      }
    };

    if (isEditing && currentShipping) {
      updateMutation.mutate({
        ...shippingData,
        id: currentShipping.id
      });
    } else {
      addMutation.mutate(shippingData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Shipping Methods</h2>
          <p className="text-muted-foreground">Manage shipping options for your store</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditing(false)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Shipping Method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Shipping Method' : 'Add Shipping Method'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update existing shipping method details' : 'Add a new shipping method to your store'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Standard Shipping"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="9.99"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Delivery via standard carrier"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_days">Estimated Days</Label>
                  <Input
                    id="estimated_days"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    placeholder="3-5 days"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
              
              <Separator className="my-2" />
              
              <h3 className="text-sm font-medium">Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_order">Minimum Order Value</Label>
                  <Input
                    id="min_order"
                    type="number"
                    min="0"
                    step="0.01"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_order">Maximum Order Value</Label>
                  <Input
                    id="max_order"
                    type="number"
                    min="0"
                    step="0.01"
                    value={maxOrderValue}
                    onChange={(e) => setMaxOrderValue(e.target.value)}
                    placeholder="No limit"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Applicable Regions</Label>
                <div className="flex gap-2">
                  <Input
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    placeholder="Enter region"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRegion())}
                  />
                  <Button type="button" onClick={handleAddRegion} variant="outline">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {applicableRegions.map((region) => (
                    <Badge key={region} variant="secondary" className="px-2 py-1">
                      {region}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => handleRemoveRegion(region)}
                      >
                        &times;
                      </Button>
                    </Badge>
                  ))}
                  {applicableRegions.length === 0 && (
                    <span className="text-sm text-muted-foreground">All regions</span>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>
                {isEditing ? 'Update' : 'Add'} Shipping Method
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {shippingMethods && shippingMethods.length > 0 ? (
          shippingMethods.map((shipping: ShippingMethod) => (
            <Card key={shipping.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    {shipping.name}
                    {!shipping.is_active && (
                      <Badge variant="outline" className="ml-2 text-xs">Inactive</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{shipping.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditShipping(shipping)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-destructive"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${shipping.name}?`)) {
                        deleteMutation.mutate(shipping.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    <p className="text-xl font-bold">${shipping.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estimated Delivery</p>
                    <p className="text-lg">{shipping.estimated_days}</p>
                  </div>
                </div>
                
                {shipping.conditions && Object.keys(shipping.conditions).length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 gap-4">
                      {shipping.conditions.min_order_value !== undefined && (
                        <div>
                          <p className="text-sm font-medium">Minimum Order</p>
                          <p>${shipping.conditions.min_order_value.toFixed(2)}</p>
                        </div>
                      )}
                      
                      {shipping.conditions.max_order_value !== undefined && (
                        <div>
                          <p className="text-sm font-medium">Maximum Order</p>
                          <p>${shipping.conditions.max_order_value.toFixed(2)}</p>
                        </div>
                      )}
                    </div>
                    
                    {shipping.conditions.applicable_regions && shipping.conditions.applicable_regions.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Regions</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {shipping.conditions.applicable_regions.map(region => (
                            <Badge key={region} variant="secondary">{region}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No shipping methods found. Create your first shipping method to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminShipping;
