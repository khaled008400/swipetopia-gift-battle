import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminCoupon } from '@/services/admin.service';
import { Loader2, Plus, Pencil, Trash2, Calendar, Tag, Percent, DollarSign } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const AdminCoupons = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState<AdminCoupon | null>(null);
  
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(0);
  const [minimumPurchase, setMinimumPurchase] = useState<number | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [usageLimit, setUsageLimit] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  const [applicableProducts, setApplicableProducts] = useState<string[]>([]);
  const [applicableCategories, setApplicableCategories] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Fetch coupons
  const { data: coupons, isLoading } = useQuery({
    queryKey: ['adminCoupons'],
    queryFn: () => AdminService.getCoupons(),
  });

  // Fetch coupon analytics
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['couponAnalytics'],
    queryFn: () => AdminService.getCouponAnalytics(),
  });

  // Add coupon mutation
  const addMutation = useMutation({
    mutationFn: (coupon: Omit<AdminCoupon, 'id' | 'usage_count' | 'created_at' | 'updated_at'>) => AdminService.createCoupon(coupon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      resetForm();
      setOpen(false);
      toast({
        title: "Success",
        description: "Coupon created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create coupon",
        variant: "destructive",
      });
      console.error("Create coupon error:", error);
    }
  });

  // Update coupon mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<AdminCoupon, 'id' | 'usage_count' | 'created_at' | 'updated_at'>> }) => 
      AdminService.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      resetForm();
      setOpen(false);
      toast({
        title: "Success",
        description: "Coupon updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update coupon",
        variant: "destructive",
      });
      console.error("Update coupon error:", error);
    }
  });

  // Delete coupon mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCoupons'] });
      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      });
      console.error("Delete coupon error:", error);
    }
  });

  const resetForm = () => {
    setCode('');
    setType('percentage');
    setValue(0);
    setMinimumPurchase(undefined);
    setExpiryDate(undefined);
    setUsageLimit(undefined);
    setIsActive(true);
    setApplicableProducts([]);
    setApplicableCategories([]);
    setCurrentCoupon(null);
    setIsEditing(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setOpen(open);
  };

  const handleEditCoupon = (coupon: AdminCoupon) => {
    setCurrentCoupon(coupon);
    setCode(coupon.code);
    setType(coupon.type);
    setValue(coupon.value);
    if (coupon.minimum_purchase) {
      setMinimumPurchase(coupon.minimum_purchase);
    }
    if (coupon.expiry_date) {
      setExpiryDate(new Date(coupon.expiry_date));
    }
    if (coupon.usage_limit) {
      setUsageLimit(coupon.usage_limit);
    }
    setIsActive(coupon.is_active);
    if (coupon.applicable_products) {
      setApplicableProducts(coupon.applicable_products);
    }
    if (coupon.applicable_categories) {
      setApplicableCategories(coupon.applicable_categories);
    }
    setIsEditing(true);
    setOpen(true);
  };

  const handleSubmit = () => {
    // Validate form
    if (!code || !value) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const couponData = {
      code,
      type,
      value,
      minimum_purchase: minimumPurchase,
      expiry_date: expiryDate ? expiryDate.toISOString() : undefined,
      usage_limit: usageLimit,
      is_active: isActive,
      applicable_products: applicableProducts.length > 0 ? applicableProducts : undefined,
      applicable_categories: applicableCategories.length > 0 ? applicableCategories : undefined,
    };

    if (isEditing && currentCoupon) {
      updateMutation.mutate({
        id: currentCoupon.id,
        data: couponData
      });
    } else {
      addMutation.mutate(couponData);
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
          <h2 className="text-2xl font-bold">Coupons</h2>
          <p className="text-muted-foreground">Manage discount coupons for your store</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditing(false)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update existing coupon details' : 'Add a new coupon to your store'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="SUMMER25"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type</Label>
                  <Select 
                    value={type} 
                    onValueChange={(val) => setType(val as 'percentage' | 'fixed')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      {type === 'percentage' ? '%' : '$'}
                    </span>
                    <Input
                      id="value"
                      type="number"
                      min="0"
                      max={type === 'percentage' ? "100" : undefined}
                      className="pl-8"
                      value={value.toString()}
                      onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-purchase">Minimum Purchase (optional)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      $
                    </span>
                    <Input
                      id="min-purchase"
                      type="number"
                      min="0"
                      step="0.01"
                      className="pl-8"
                      value={minimumPurchase !== undefined ? minimumPurchase.toString() : ''}
                      onChange={(e) => setMinimumPurchase(e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date (optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {expiryDate ? format(expiryDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={expiryDate}
                        onSelect={setExpiryDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="usage-limit">Usage Limit (optional)</Label>
                  <Input
                    id="usage-limit"
                    type="number"
                    min="0"
                    value={usageLimit !== undefined ? usageLimit.toString() : ''}
                    onChange={(e) => setUsageLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Unlimited"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is-active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="is-active">Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>
                {isEditing ? 'Update' : 'Add'} Coupon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Usage Over Time</CardTitle>
              <CardDescription>Number of times coupons were used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analytics.usage_over_time}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Most Used Coupons</CardTitle>
              <CardDescription>Top 5 most redeemed coupons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analytics.most_used_coupons}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="code" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usage_count" fill="#82ca9d" name="Usage Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6">
        {coupons && coupons.length > 0 ? (
          coupons.map((coupon: AdminCoupon) => (
            <Card key={coupon.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    <Tag className="mr-2 h-5 w-5" />
                    {coupon.code}
                    {!coupon.is_active && (
                      <Badge variant="outline" className="ml-2 text-xs">Inactive</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    {coupon.type === 'percentage' ? (
                      <Percent className="mr-1 h-4 w-4" />
                    ) : (
                      <DollarSign className="mr-1 h-4 w-4" />
                    )}
                    {coupon.type === 'percentage' ? `${coupon.value}% off` : `$${coupon.value.toFixed(2)} off`}
                    
                    {coupon.minimum_purchase && (
                      <span className="ml-2 text-xs">
                        (Min. ${coupon.minimum_purchase.toFixed(2)})
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditCoupon(coupon)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-destructive"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${coupon.code}?`)) {
                        deleteMutation.mutate(coupon.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Expiry</p>
                    <p>{coupon.expiry_date ? format(new Date(coupon.expiry_date), 'PP') : 'No expiry'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Usage</p>
                    <p>{coupon.usage_count} / {coupon.usage_limit || '∞'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p>{format(new Date(coupon.created_at), 'PP')}</p>
                  </div>
                </div>
                
                {(coupon.applicable_products?.length > 0 || coupon.applicable_categories?.length > 0) && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      {coupon.applicable_products?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Applicable Products</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {coupon.applicable_products.map(productId => (
                              <Badge key={productId} variant="secondary">{productId}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {coupon.applicable_categories?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Applicable Categories</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {coupon.applicable_categories.map(category => (
                              <Badge key={category} variant="secondary">{category}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No coupons found. Create your first coupon to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
