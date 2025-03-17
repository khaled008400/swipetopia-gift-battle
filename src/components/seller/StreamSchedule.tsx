import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  CalendarIcon, PlusCircle, Clock, Pencil, 
  Calendar as CalendarCheck, AlertTriangle, 
  Users, Loader2
} from "lucide-react";
import { Product } from "@/types/product.types";
import { format } from "date-fns";

const dummyScheduledStreams = [
  {
    id: "1",
    title: "Summer Collection Preview",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // in 2 days
    startTime: "18:00",
    endTime: "19:30",
    isBattle: false,
    opponent: null,
    status: "scheduled",
  },
  {
    id: "2",
    title: "Fashion Battle with @style_guru",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // in 5 days
    startTime: "20:00",
    endTime: "21:00",
    isBattle: true,
    opponent: {
      username: "style_guru",
      avatar_url: "https://i.pravatar.cc/150?u=style_guru",
    },
    status: "scheduled",
  },
  {
    id: "3",
    title: "New Arrivals Showcase",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // in 7 days
    startTime: "19:00",
    endTime: "20:00",
    isBattle: false,
    opponent: null,
    status: "scheduled",
  }
];

const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Summer T-Shirt",
    price: 29.99,
    description: "Comfortable cotton t-shirt for summer",
    image_url: "https://placehold.co/400x400/333/FFF?text=T-Shirt",
    category: "clothing",
    stock_quantity: 100,
    status: "active",
    seller_id: "seller-123",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: false
  },
  {
    id: "2",
    name: "Designer Sunglasses",
    price: 89.99,
    description: "Stylish sunglasses with UV protection",
    image_url: "https://placehold.co/400x400/333/FFF?text=Sunglasses",
    category: "accessories",
    stock_quantity: 30,
    status: "active",
    seller_id: "seller-123",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: true
  },
  {
    id: "3",
    name: "Summer Shorts",
    price: 39.99,
    description: "Comfortable shorts for hot days",
    image_url: "https://placehold.co/400x400/333/FFF?text=Shorts",
    category: "clothing",
    stock_quantity: 75,
    status: "active",
    seller_id: "seller-123",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: false
  },
  {
    id: "4",
    name: "Beach Sandals",
    price: 24.99,
    description: "Comfortable sandals for the beach",
    image_url: "https://placehold.co/400x400/333/FFF?text=Sandals",
    category: "footwear",
    stock_quantity: 50,
    status: "active",
    seller_id: "seller-123",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: false
  },
  {
    id: "5",
    name: "Summer Hat",
    price: 19.99,
    description: "Stylish hat to protect from sun",
    image_url: "https://placehold.co/400x400/333/FFF?text=Hat",
    category: "accessories",
    stock_quantity: 40,
    status: "active",
    seller_id: "seller-123",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: false
  }
];

const StreamSchedule = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  
  const handleDateSelect = (day: Date | undefined) => {
    setDate(day);
  };
  
  const dateHasStream = (date: Date) => {
    return dummyScheduledStreams.some(stream => 
      stream.date.toDateString() === date.toDateString()
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Upcoming Streams</h2>
        <Button onClick={() => setShowDialog(true)} className="bg-app-yellow text-app-black">
          <PlusCircle className="h-4 w-4 mr-2" /> Schedule Stream
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-app-gray-dark">
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="border border-muted rounded-md p-3"
              modifiersStyles={{
                today: {
                  fontWeight: 'bold',
                  borderWidth: '2px',
                  borderColor: 'var(--app-yellow)'
                }
              }}
              modifiers={{
                hasStream: (date) => dateHasStream(date)
              }}
              modifiersClassNames={{
                hasStream: "bg-app-yellow/30"
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark">
          <CardHeader>
            <CardTitle className="text-lg">Scheduled Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dummyScheduledStreams.map((stream) => (
                <div key={stream.id} className="border border-muted rounded-md p-3 flex justify-between">
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="font-semibold">{stream.title}</h3>
                      {stream.isBattle && (
                        <Badge className="ml-2 bg-purple-500">Battle</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <CalendarCheck className="h-3 w-3 mr-1" /> 
                      {format(stream.date, "MMMM d, yyyy")}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" /> 
                      {stream.startTime} - {stream.endTime}
                    </div>
                    {stream.isBattle && stream.opponent && (
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Users className="h-3 w-3 mr-1" /> 
                        Battle with @{stream.opponent.username}
                      </div>
                    )}
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule a New Stream</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Stream Title
              </label>
              <Input
                id="title"
                placeholder="Enter stream title"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <div className="relative">
                  <Input
                    id="date"
                    placeholder="Select date"
                    value={date ? format(date, "PPP") : ""}
                    readOnly
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Start Time
                </label>
                <Input
                  id="time"
                  type="time"
                  className="col-span-3"
                  defaultValue="18:00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Products to Feature</label>
              <div className="border border-input rounded-md px-3 py-2 h-40 overflow-auto">
                <div className="space-y-2">
                  {dummyProducts.map((product) => (
                    <div key={product.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`product-${product.id}`}
                        className="flex items-center text-sm"
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-8 h-8 rounded object-cover mr-2"
                        />
                        <span className="flex-1">{product.name}</span>
                        <span className="ml-auto text-app-yellow">${product.price.toFixed(2)}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-app-yellow text-app-black" 
                disabled={loading}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    setShowDialog(false);
                  }, 1000);
                }}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Schedule Stream
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StreamSchedule;
