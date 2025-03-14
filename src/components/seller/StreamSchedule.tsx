import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Plus, Link2, Edit2, Trash2, Eye, ShoppingBag } from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter, DialogClose 
} from "@/components/ui/dialog";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/services/shop.service";

// Dummy data for upcoming streams
const upcomingStreams = [
  {
    id: "1",
    title: "New Summer Collection",
    description: "Showcasing our new summer fashion line with exclusive discounts.",
    date: new Date(Date.now() + 86400000 * 2), // 2 days from now
    duration: 60, // minutes
    products: ["1", "2", "3"],
    status: "scheduled"
  },
  {
    id: "2",
    title: "Tech Gadgets Review",
    description: "Reviewing the latest tech gadgets and accessories with special offers.",
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    duration: 45, // minutes
    products: ["4", "5"],
    status: "scheduled"
  },
];

// Dummy data for past streams
const pastStreams = [
  {
    id: "3",
    title: "Winter Collection Closeout",
    description: "Final sale on winter items with huge discounts.",
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    duration: 55, // minutes
    products: ["6", "7", "8"],
    status: "completed",
    views: 1243,
    sales: 28
  },
  {
    id: "4",
    title: "Home Office Essentials",
    description: "Everything you need for your home office setup.",
    date: new Date(Date.now() - 86400000 * 7), // 7 days ago
    duration: 50, // minutes
    products: ["9", "10"],
    status: "completed",
    views: 876,
    sales: 15
  },
];

// Dummy products data
const dummyProducts: Product[] = [
  { id: "1", name: "Summer T-Shirt", price: 24.99, image: "https://placehold.co/100x100/333/FFF?text=T-Shirt", rating: 4.5 },
  { id: "2", name: "Floral Dress", price: 49.99, image: "https://placehold.co/100x100/333/FFF?text=Dress", rating: 4.8 },
  { id: "3", name: "Denim Shorts", price: 34.99, image: "https://placehold.co/100x100/333/FFF?text=Shorts", rating: 4.2 },
  { id: "4", name: "Wireless Earbuds", price: 79.99, image: "https://placehold.co/100x100/333/FFF?text=Earbuds", rating: 4.7 },
  { id: "5", name: "Smart Watch", price: 129.99, image: "https://placehold.co/100x100/333/FFF?text=Watch", rating: 4.9 },
];

// Create form schema
const streamFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().optional(),
  date: z.date({ required_error: "Please select a date" }),
  duration: z.number().min(15, { message: "Stream must be at least 15 minutes" }),
  products: z.array(z.string()).optional(),
});

type StreamFormValues = z.infer<typeof streamFormSchema>;

const StreamSchedule = () => {
  const { toast } = useToast();
  const [showStreamDialog, setShowStreamDialog] = useState(false);
  const [editingStream, setEditingStream] = useState<any | null>(null);
  const [streamProducts, setStreamProducts] = useState<string[]>([]);
  
  const form = useForm<StreamFormValues>({
    resolver: zodResolver(streamFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 30,
      products: [],
    }
  });

  const handleCreateStream = () => {
    setEditingStream(null);
    form.reset({
      title: "",
      description: "",
      duration: 30,
      date: undefined,
      products: [],
    });
    setStreamProducts([]);
    setShowStreamDialog(true);
  };

  const handleEditStream = (stream: any) => {
    setEditingStream(stream);
    form.reset({
      title: stream.title,
      description: stream.description || "",
      date: new Date(stream.date),
      duration: stream.duration,
      products: stream.products || [],
    });
    setStreamProducts(stream.products || []);
    setShowStreamDialog(true);
  };

  const onSubmit = (data: StreamFormValues) => {
    // In a real app, this would send data to your backend
    console.log("Stream data:", data);
    
    toast({
      title: editingStream ? "Stream updated" : "Stream scheduled",
      description: editingStream 
        ? "Your stream has been updated successfully." 
        : "Your stream has been scheduled successfully.",
    });
    
    setShowStreamDialog(false);
  };

  const handleDeleteStream = (streamId: string) => {
    if (!confirm("Are you sure you want to delete this stream?")) return;
    
    // In a real app, this would delete the stream from your backend
    console.log("Delete stream:", streamId);
    
    toast({
      title: "Stream deleted",
      description: "The stream has been deleted successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Stream Schedule</h2>
        <Button onClick={handleCreateStream} className="bg-app-yellow text-app-black">
          <Plus className="mr-2 h-4 w-4" /> Schedule Stream
        </Button>
      </div>

      <Card className="bg-app-gray-dark">
        <CardHeader>
          <CardTitle>Upcoming Streams</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingStreams.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <CalendarIcon className="mx-auto h-10 w-10 mb-2" />
              <p>No upcoming streams scheduled</p>
              <Button 
                variant="link" 
                onClick={handleCreateStream}
                className="mt-2 text-app-yellow"
              >
                Schedule your first stream
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingStreams.map((stream) => (
                <div key={stream.id} className="bg-app-gray-darker rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{stream.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{format(new Date(stream.date), "MMM d, yyyy 'at' h:mm a")}</span>
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        <span>{stream.duration} minutes</span>
                      </div>
                      <p className="text-sm mt-2">{stream.description}</p>
                      
                      {stream.products && stream.products.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs font-semibold text-gray-400 mb-1">Linked Products:</div>
                          <div className="flex flex-wrap gap-2">
                            {stream.products.map((productId) => {
                              const product = dummyProducts.find(p => p.id === productId);
                              return product ? (
                                <Badge key={productId} variant="secondary" className="flex items-center">
                                  <Link2 className="h-3 w-3 mr-1" />
                                  {product.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEditStream(stream)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteStream(stream.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-app-gray-dark">
        <CardHeader>
          <CardTitle>Past Streams</CardTitle>
        </CardHeader>
        <CardContent>
          {pastStreams.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p>No past streams</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastStreams.map((stream) => (
                <div key={stream.id} className="bg-app-gray-darker rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{stream.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{format(new Date(stream.date), "MMM d, yyyy 'at' h:mm a")}</span>
                        <span className="mx-2">•</span>
                        <span>{stream.duration} min</span>
                      </div>
                      
                      <div className="flex items-center mt-2 text-sm gap-4">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-blue-400" />
                          <span>{stream.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-1 text-green-400" />
                          <span>{stream.sales} sales</span>
                        </div>
                      </div>
                      
                      {stream.products && stream.products.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs font-semibold text-gray-400 mb-1">Products featured:</div>
                          <div className="flex flex-wrap gap-2">
                            {stream.products.map((productId) => {
                              const product = dummyProducts.find(p => p.id === productId);
                              return product ? (
                                <Badge key={productId} variant="secondary" className="flex items-center">
                                  <Link2 className="h-3 w-3 mr-1" />
                                  {product.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View Analytics
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showStreamDialog} onOpenChange={setShowStreamDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingStream ? "Edit Stream" : "Schedule New Stream"}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stream Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter stream title" {...field} />
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
                      <Textarea 
                        placeholder="Describe what you'll be showcasing" 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="products"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Products</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          const updatedProducts = [...streamProducts, value];
                          setStreamProducts(updatedProducts);
                          field.onChange(updatedProducts);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select products to feature" />
                        </SelectTrigger>
                        <SelectContent>
                          {dummyProducts
                            .filter(p => !streamProducts.includes(p.id))
                            .map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} (${product.price})
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    
                    {streamProducts.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-medium mb-1">Selected Products:</div>
                        <div className="flex flex-wrap gap-2">
                          {streamProducts.map(productId => {
                            const product = dummyProducts.find(p => p.id === productId);
                            return product ? (
                              <Badge 
                                key={productId} 
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {product.name}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                                  onClick={() => {
                                    const updatedProducts = streamProducts.filter(id => id !== productId);
                                    setStreamProducts(updatedProducts);
                                    field.onChange(updatedProducts);
                                  }}
                                >
                                  ×
                                </Button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-app-yellow text-app-black">
                  {editingStream ? "Update Stream" : "Schedule Stream"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StreamSchedule;
