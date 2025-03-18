
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react" // Replace @radix-ui/react-icons with lucide-react
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/product.types";

interface StreamScheduleProps {
  onScheduleStream: (scheduleData: any) => void;
}

const StreamSchedule: React.FC<StreamScheduleProps> = ({ onScheduleStream }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("12:00");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [isPublic, setIsPublic] = useState(true);
  const [duration, setDuration] = useState(60);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const categories = ["Entertainment", "Music", "Gaming", "Education", "Sports"];

  const mockFeaturedProducts: Product[] = [
    {
      id: "product-1",
      name: "Summer T-shirt",
      price: 29.99,
      description: "Comfortable cotton t-shirt perfect for summer.",
      image_url: "/products/tshirt.jpg",
      category: "Clothing",
      stock_quantity: 45,
      status: "active" as const,
      seller_id: "seller-123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_featured: true
    },
    {
      id: "product-2",
      name: "Wireless Headphones",
      price: 99.99,
      description: "High-quality wireless headphones with noise cancellation.",
      image_url: "/products/headphones.jpg",
      category: "Electronics",
      stock_quantity: 20,
      status: "active" as const,
      seller_id: "seller-123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_featured: true
    },
  ];

  useEffect(() => {
    setFeaturedProducts(mockFeaturedProducts);
  }, []);

  const handleSubmit = () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hours, minutes, 0, 0);

    const scheduleData = {
      scheduledDate: scheduledDate.toISOString(),
      title,
      description,
      category,
      isPublic,
      duration,
      featuredProducts,
    };

    onScheduleStream(scheduleData);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" side="bottom">
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={setDate} 
              disabled={(date) => date < new Date()} // Fix: Use disabled prop instead of disabledDates
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="time">Time</Label>
        <Input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="public">Public</Label>
        <Switch
          id="public"
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />
      </div>

      <div>
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Slider
          id="duration"
          defaultValue={[duration]}
          max={180}
          step={15}
          onValueChange={(value) => setDuration(value[0])}
        />
        <p className="text-sm text-muted-foreground">
          {duration} minutes
        </p>
      </div>

      <div>
        <Label>Featured Products</Label>
        {featuredProducts.map((product) => (
          <div key={product.id} className="flex items-center space-x-2">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-10 h-10 rounded-md"
            />
            <span>{product.name}</span>
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit}>Schedule Stream</Button>
    </div>
  );
};

export default StreamSchedule;
