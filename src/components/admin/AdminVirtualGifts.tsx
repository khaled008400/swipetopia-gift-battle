import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService from '@/services/admin.service';
import type { VirtualGift } from '@/services/admin.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Edit, Gift, Plus, Search, Trash2, Upload } from 'lucide-react';

const defaultGift: Omit<VirtualGift, 'id' | 'created_at'> = {
  name: '',
  description: '',
  price: 0,
  value: 0,
  imageUrl: '',
  imageType: 'svg',
  hasSound: false,
  soundUrl: '',
  category: 'basic',
  available: true,
  color: '#FFFFFF',
  icon: 'gift',
  is_premium: false
};

const AdminVirtualGifts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [giftFormOpen, setGiftFormOpen] = useState(false);
  const [currentGift, setCurrentGift] = useState<Partial<VirtualGift>>(defaultGift);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch gifts
  const { data: gifts, isLoading } = useQuery({
    queryKey: ['adminGifts', selectedCategory],
    queryFn: () => AdminService.getVirtualGifts(1, 20, selectedCategory === 'all' ? undefined : selectedCategory)
  });
  
  // Fetch gift usage statistics
  const { data: giftStats } = useQuery({
    queryKey: ['giftStats'],
    queryFn: () => AdminService.getGiftUsageStats()
  });
  
  // Create mutation
  const createGiftMutation = useMutation({
    mutationFn: (giftData: Omit<VirtualGift, 'id' | 'created_at'>) => 
      AdminService.createVirtualGift(giftData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGifts'] });
      setGiftFormOpen(false);
      setCurrentGift(defaultGift);
      toast({
        title: "Gift created",
        description: "Virtual gift has been created successfully",
      });
    }
  });
  
  // Update mutation
  const updateGiftMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VirtualGift> }) => 
      AdminService.updateVirtualGift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGifts'] });
      setGiftFormOpen(false);
      setIsEditing(false);
      setCurrentGift(defaultGift);
      toast({
        title: "Gift updated",
        description: "Virtual gift has been updated successfully",
      });
    }
  });
  
  // Delete mutation
  const deleteGiftMutation = useMutation({
    mutationFn: (id: string) => AdminService.deleteVirtualGift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGifts'] });
      toast({
        title: "Gift deleted",
        description: "Virtual gift has been deleted successfully",
      });
    }
  });
  
  // Toggle availability mutation
  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, available }: { id: string; available: boolean }) => 
      AdminService.toggleGiftAvailability(id, available),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminGifts'] });
    }
  });
  
  const handleCreateGift = () => {
    if (currentGift.name && typeof currentGift.price === 'number' && currentGift.price > 0) {
      const giftData: Omit<VirtualGift, 'id' | 'created_at'> = {
        name: currentGift.name!,
        description: currentGift.description || '',
        price: currentGift.price,
        value: currentGift.value || currentGift.price,
        imageUrl: currentGift.imageUrl!,
        imageType: currentGift.imageType as 'gif' | 'svg',
        hasSound: currentGift.hasSound || false,
        soundUrl: currentGift.soundUrl,
        category: currentGift.category || 'basic',
        available: currentGift.available !== undefined ? currentGift.available : true,
        color: currentGift.color || '#FFFFFF',
        icon: currentGift.icon || 'gift',
        is_premium: currentGift.is_premium || false
      };
      createGiftMutation.mutate(giftData);
    } else {
      toast({
        title: "Validation error",
        description: "Name and price are required. Price must be greater than 0.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateGift = () => {
    if (currentGift.id && currentGift.name && typeof currentGift.price === 'number' && currentGift.price > 0) {
      const giftData: Partial<VirtualGift> = {
        name: currentGift.name,
        description: currentGift.description,
        price: currentGift.price,
        imageUrl: currentGift.imageUrl,
        imageType: currentGift.imageType as 'gif' | 'svg',
        hasSound: currentGift.hasSound,
        soundUrl: currentGift.soundUrl,
        category: currentGift.category,
        available: currentGift.available
      };
      updateGiftMutation.mutate({ 
        id: currentGift.id, 
        data: giftData
      });
    } else {
      toast({
        title: "Validation error",
        description: "Name and price are required. Price must be greater than 0.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteGift = (id: string) => {
    if (confirm('Are you sure you want to delete this gift?')) {
      deleteGiftMutation.mutate(id);
    }
  };
  
  const handleToggleAvailability = (id: string, currentStatus: boolean) => {
    toggleAvailabilityMutation.mutate({ id, available: !currentStatus });
  };
  
  const handleEditGift = (gift: VirtualGift) => {
    setCurrentGift(gift);
    setIsEditing(true);
    setGiftFormOpen(true);
  };
  
  const handleAddNew = () => {
    setCurrentGift(defaultGift);
    setIsEditing(false);
    setGiftFormOpen(true);
  };
  
  const filteredGifts = gifts?.data?.filter(gift => 
    gift.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    gift.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Virtual Gifts Management</h2>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Gift
        </Button>
      </div>
      
      <Tabs defaultValue="gifts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gifts">All Gifts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gifts" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search gifts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="special">Special</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="text-center py-10">Loading gifts...</div>
          ) : (
            <div className="bg-white rounded-md shadow overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGifts.length > 0 ? (
                    filteredGifts.map((gift) => (
                      <TableRow key={gift.id}>
                        <TableCell>
                          {gift.imageUrl ? (
                            <img 
                              src={gift.imageUrl} 
                              alt={gift.name} 
                              className="w-10 h-10 object-contain" 
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                              <Gift className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {gift.name}
                          {gift.hasSound && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                              Sound
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{gift.price} coins</TableCell>
                        <TableCell>
                          <span className="capitalize">{gift.category}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              checked={gift.available} 
                              onCheckedChange={() => handleToggleAvailability(gift.id, gift.available)}
                            />
                            <span>{gift.available ? "Available" : "Hidden"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditGift(gift)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteGift(gift.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No gifts found. Try changing your search criteria or creating a new gift.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Gifts Sent</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {giftStats?.totalSent || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>From virtual gifts (coins)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {giftStats?.totalRevenue || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Most Popular Gift</CardTitle>
                <CardDescription>By number of sends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {giftStats?.mostPopular?.name || 'None'}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Gift Usage Over Time</CardTitle>
              <CardDescription>Total gifts sent per day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <BarChart className="h-16 w-16 text-gray-300" />
                  <p className="text-gray-500 mt-4">Gift usage chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Gifted Streamers</CardTitle>
              <CardDescription>Streamers receiving the most gifts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Streamer</TableHead>
                    <TableHead>Total Gifts Received</TableHead>
                    <TableHead>Gift Value (coins)</TableHead>
                    <TableHead>Most Common Gift</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {giftStats?.topStreamers?.map((streamer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{streamer.username}</TableCell>
                      <TableCell>{streamer.giftsReceived}</TableCell>
                      <TableCell>{streamer.totalValue}</TableCell>
                      <TableCell>{streamer.topGift}</TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Gift Form Dialog */}
      <Dialog open={giftFormOpen} onOpenChange={setGiftFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Virtual Gift" : "Create New Virtual Gift"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="gift-name">Gift Name</Label>
              <Input
                id="gift-name"
                value={currentGift.name || ''}
                onChange={(e) => setCurrentGift({...currentGift, name: e.target.value})}
                placeholder="Enter gift name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gift-description">Description</Label>
              <Textarea
                id="gift-description"
                value={currentGift.description || ''}
                onChange={(e) => setCurrentGift({...currentGift, description: e.target.value})}
                placeholder="Enter gift description"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gift-price">Price (coins)</Label>
              <Input
                id="gift-price"
                type="number"
                value={currentGift.price || ''}
                onChange={(e) => setCurrentGift({...currentGift, price: Number(e.target.value)})}
                placeholder="Enter price in coins"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gift-category">Category</Label>
              <Select 
                value={currentGift.category || 'basic'} 
                onValueChange={(value) => setCurrentGift({...currentGift, category: value})}
              >
                <SelectTrigger id="gift-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gift-image">Image URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="gift-image"
                  value={currentGift.imageUrl || ''}
                  onChange={(e) => setCurrentGift({...currentGift, imageUrl: e.target.value})}
                  placeholder="Enter image URL"
                  className="flex-grow"
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Image Type</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="type-svg"
                    name="imageType"
                    checked={currentGift.imageType === 'svg'}
                    onChange={() => setCurrentGift({...currentGift, imageType: 'svg'})}
                  />
                  <Label htmlFor="type-svg">SVG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="type-gif"
                    name="imageType"
                    checked={currentGift.imageType === 'gif'}
                    onChange={() => setCurrentGift({...currentGift, imageType: 'gif'})}
                  />
                  <Label htmlFor="type-gif">GIF</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="has-sound"
                  checked={currentGift.hasSound || false}
                  onCheckedChange={(checked) => setCurrentGift({...currentGift, hasSound: checked})}
                />
                <Label htmlFor="has-sound">Has Sound Effect</Label>
              </div>
            </div>
            
            {currentGift.hasSound && (
              <div className="space-y-2">
                <Label htmlFor="sound-url">Sound URL</Label>
                <Input
                  id="sound-url"
                  value={currentGift.soundUrl || ''}
                  onChange={(e) => setCurrentGift({...currentGift, soundUrl: e.target.value})}
                  placeholder="Enter sound URL"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="gift-available"
                  checked={currentGift.available ?? true}
                  onCheckedChange={(checked) => setCurrentGift({...currentGift, available: checked})}
                />
                <Label htmlFor="gift-available">Make Gift Available</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setGiftFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={isEditing ? handleUpdateGift : handleCreateGift}>
              {isEditing ? "Update Gift" : "Create Gift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVirtualGifts;
