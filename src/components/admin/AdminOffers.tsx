
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminOffer } from '@/services/admin.service';
import { Loader2, Plus, Pencil, Trash2, Calendar, Tag, Percent, DollarSign, ShoppingBag, Package } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminOffers = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<AdminOffer | null>(null);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed' | 'buy_x_get_y' | 'bundle'>('percentage');
  const [value, setValue] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  const [applicableProducts, setApplicableProducts] = useState<string[]>([]);
  const [applicableCategories, setApplicableCategories] = useState<string[]>([]);
  
  // Buy X Get Y rule fields
  const [buyQuantity, setBuyQuantity] = useState<number | undefined>(undefined);
  const [getQuantity, setGetQuantity] = useState<number | undefined>(undefined);
  
  // Bundle rule fields
  const [bundleProducts, setBundleProducts] = useState<string[]>([]);
  const [bundlePrice, setBundlePrice] = useState<number | undefined>(undefined);

  const queryClient = useQueryClient();

  // Fetch offers
  const { data: offers, isLoading } = useQuery({
    queryKey: ['adminOffers'],
    queryFn: () => AdminService.getOffers(),
  });

  // Fetch offer analytics
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['offerAnalytics'],
    queryFn: () => AdminService.getOfferAnalytics(),
  });

  // Add offer mutation
  const addMutation = useMutation({
    mutationFn: (offer: Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>) => AdminService.createOffer(offer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOffers'] });
      resetForm();
      setOpen(false);
      toast({
        title: "Success",
        description: "Offer created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create offer",
        variant: "destructive",
      });
      console.error("Create offer error:", error);
    }
  });

  // Update offer mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<AdminOffer, 'id' | 'created_at' | 'updated_at'>> }) => 
      AdminService.updateOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOffers'] });
      resetForm();
      setOpen(false);
      toast({
        title: "Success",
        description: "Offer updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update offer",
        variant: "destructive",
      });
      console.error("Update offer error:", error);
    }
  });

  // Delete offer mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOffers'] });
      toast({
        title: "Success",
        description: "Offer deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive",
      });
      console.error("Delete offer error:", error);
    }
  });

  const resetForm = () => {
    setName('');
    setDescription('');
    setType('percentage');
    setValue(0);
    setStartDate(undefined);
    setEndDate(undefined);
    setIsActive(true);
    setApplicableProducts([]);
    setApplicableCategories([]);
    setBuyQuantity(undefined);
    setGetQuantity(undefined);
    setBundleProducts([]);
    setBundlePrice(undefined);
    setCurrentOffer(null);
    setIsEditing(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setOpen(open);
  };

  const handleEditOffer = (offer: AdminOffer) => {
    setCurrentOffer(offer);
    setName(offer.name);
    setDescription(offer.description || '');
    setType(offer.type);
    setValue(offer.value);
    
    if (offer.start_date) {
      setStartDate(new Date(offer.start_date));
    }
    
    if (offer.end_date) {
      setEndDate(new Date(offer.end_date));
    }
    
    setIsActive(offer.is_active);
    
    if (offer.applicable_products) {
      setApplicableProducts(offer.applicable_products);
    }
    
    if (offer.applicable_categories) {
      setApplicableCategories(offer.applicable_categories);
    }
    
    if (offer.rules) {
      if (offer.rules.buy_quantity) {
        setBuyQuantity(offer.rules.buy_quantity);
      }
      
      if (offer.rules.get_quantity) {
        setGetQuantity(offer.rules.get_quantity);
      }
      
      if (offer.rules.bundle_products) {
        setBundleProducts(offer.rules.bundle_products);
      }
      
      if (offer.rules.bundle_price) {
        setBundlePrice(offer.rules.bundle_price);
      }
    }
    
    setIsEditing(true);
    setOpen(true);
  };

  const handleSubmit = () => {
    // Validate form
    if (!name || !value || !type || !startDate || !endDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Additional validation for specific types
    if (type === 'buy_x_get_y' && (!buyQuantity || !getQuantity)) {
      toast({
        title: "Validation Error",
        description: "Buy X Get Y offers require quantities",
        variant: "destructive",
      });
      return;
    }
    
    if (type === 'bundle' && (!bundleProducts.length || !bundlePrice)) {
      toast({
        title: "Validation Error",
        description: "Bundle offers require products and price",
        variant: "destructive",
      });
      return;
    }
    
    // Build rules based on offer type
    const rules: any = {};
    
    if (type === 'buy_x_get_y') {
      rules.buy_quantity = buyQuantity;
      rules.get_quantity = getQuantity;
    } else if (type === 'bundle') {
      rules.bundle_products = bundleProducts;
      rules.bundle_price = bundlePrice;
    }

    const offerData: any = {
      name,
      description,
      type,
      value,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      is_active: isActive,
      applicable_products: applicableProducts.length > 0 ? applicableProducts : undefined,
      applicable_categories: applicableCategories.length > 0 ? applicableCategories : undefined,
    };
    
    // Only add rules if they exist
    if (Object.keys(rules).length > 0) {
      offerData.rules = rules;
    }

    if (isEditing && currentOffer) {
      updateMutation.mutate({
        id: currentOffer.id,
        data: offerData
      });
    } else {
      addMutation.mutate(offerData);
    }
  };

  const getOfferTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="h-5 w-5" />;
      case 'fixed':
        return <DollarSign className="h-5 w-5" />;
      case 'buy_x_get_y':
        return <ShoppingBag className="h-5 w-5" />;
      case 'bundle':
        return <Package className="h-5 w-5" />;
      default:
        return <Tag className="h-5 w-5" />;
    }
  };

  const formatOfferValue = (offer: AdminOffer) => {
    switch (offer.type) {
      case 'percentage':
        return `${offer.value}% off`;
      case 'fixed':
        return `$${offer.value.toFixed(2)} off`;
      case 'buy_x_get_y':
        return `Buy ${offer.rules?.buy_quantity}, Get ${offer.rules?.get_quantity} Free`;
      case 'bundle':
        return `Bundle for $${offer.rules?.bundle_price?.toFixed(2)}`;
      default:
        return '';
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
          <h2 className="text-2xl font-bold">Special Offers</h2>
          <p className="text-muted-foreground">Manage promotional offers for your store</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsEditing(false)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Offer' : 'Add Offer'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Update existing offer details' : 'Add a new promotional offer to your store'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Offer Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Summer Sale"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Special offer for summer season"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Offer Type</Label>
                  <Select 
                    value={type} 
                    onValueChange={(val) => setType(val as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Discount</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                      <SelectItem value="buy_x_get_y">Buy X Get Y Free</SelectItem>
                      <SelectItem value="bundle">Bundle Offer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value">
                    {type === 'percentage' ? 'Discount Percentage' : 
                     type === 'fixed' ? 'Discount Amount' : 
                     type === 'buy_x_get_y' ? 'Discount Value' : 
                     'Bundle Discount'}
                  </Label>
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
              
              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Type-specific fields */}
              {type === 'buy_x_get_y' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buy-quantity">Buy Quantity</Label>
                    <Input
                      id="buy-quantity"
                      type="number"
                      min="1"
                      value={buyQuantity || ''}
                      onChange={(e) => setBuyQuantity(parseInt(e.target.value) || undefined)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="get-quantity">Get Free Quantity</Label>
                    <Input
                      id="get-quantity"
                      type="number"
                      min="1"
                      value={getQuantity || ''}
                      onChange={(e) => setGetQuantity(parseInt(e.target.value) || undefined)}
                    />
                  </div>
                </div>
              )}
              
              {type === 'bundle' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bundle-products">Bundle Products (IDs)</Label>
                    <Textarea
                      id="bundle-products"
                      value={bundleProducts.join(', ')}
                      onChange={(e) => setBundleProducts(e.target.value.split(',').map(p => p.trim()).filter(Boolean))}
                      placeholder="product1, product2, product3"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bundle-price">Bundle Price</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <Input
                        id="bundle-price"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-8"
                        value={bundlePrice || ''}
                        onChange={(e) => setBundlePrice(parseFloat(e.target.value) || undefined)}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="is-active">Active</Label>
              </div>
              
              {/* Additional fields can be added here for applicable products and categories */}
              
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>
                {isEditing ? 'Update' : 'Add'} Offer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Section */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Offer Performance</CardTitle>
              <CardDescription>Redemptions over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analytics.performance_over_time}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="redemptions" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Offer Type Distribution</CardTitle>
              <CardDescription>Breakdown by offer type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.type_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.type_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Offers List */}
      <div className="grid gap-6">
        {offers && offers.length > 0 ? (
          offers.map((offer: AdminOffer) => (
            <Card key={offer.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl flex items-center">
                    {getOfferTypeIcon(offer.type)}
                    <span className="ml-2">{offer.name}</span>
                    {!offer.is_active && (
                      <Badge variant="outline" className="ml-2 text-xs">Inactive</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{offer.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditOffer(offer)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-destructive"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${offer.name}?`)) {
                        deleteMutation.mutate(offer.id);
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
                    <p className="text-sm font-medium">Discount</p>
                    <p className="text-xl font-bold">{formatOfferValue(offer)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date Range</p>
                    <p>{format(new Date(offer.start_date), 'PP')} - {format(new Date(offer.end_date), 'PP')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge variant={offer.is_active ? "success" : "outline"}>
                      {offer.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                {(offer.applicable_products?.length > 0 || offer.applicable_categories?.length > 0) && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      {offer.applicable_products?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Applicable Products</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {offer.applicable_products.map(productId => (
                              <Badge key={productId} variant="secondary">{productId}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {offer.applicable_categories?.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Applicable Categories</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {offer.applicable_categories.map(category => (
                              <Badge key={category} variant="secondary">{category}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                {offer.type === 'bundle' && offer.rules?.bundle_products?.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <p className="text-sm font-medium">Bundle Products</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {offer.rules.bundle_products.map(productId => (
                          <Badge key={productId} variant="secondary">{productId}</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No offers found. Create your first offer to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;
