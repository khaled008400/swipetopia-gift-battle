
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/services/api";
import { VirtualGift } from "@/types/gift.types";
import { Plus, Edit, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function VirtualGifts() {
  const [gifts, setGifts] = useState<VirtualGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<VirtualGift | null>(null);
  const { toast } = useToast();

  const [giftName, setGiftName] = useState("");
  const [giftPrice, setGiftPrice] = useState<number>(0);
  const [giftIcon, setGiftIcon] = useState("");
  const [giftColor, setGiftColor] = useState("#FFD700");
  const [giftValue, setGiftValue] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [giftDescription, setGiftDescription] = useState("");

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        const mockGifts: VirtualGift[] = [
          {
            id: "1",
            name: "Diamond",
            price: 500,
            icon: "💎",
            color: "#3498db",
            value: 500,
            available: true,
            created_at: new Date().toISOString(),
            description: "A sparkling diamond gift", 
            imageUrl: "/assets/gifts/diamond.png", 
            imageType: "svg",
            hasSound: false,
            soundUrl: "",
            category: "Premium",
            is_premium: true,
          },
          {
            id: "2",
            name: "Heart",
            price: 100,
            icon: "❤️",
            color: "#e74c3c",
            value: 100,
            available: true,
            created_at: new Date().toISOString(),
            description: "A loving heart gift", 
            imageUrl: "/assets/gifts/heart.png", 
            imageType: "svg",
            hasSound: false,
            soundUrl: "",
            category: "Standard",
            is_premium: false,
          },
          {
            id: "3",
            name: "Star",
            price: 250,
            icon: "⭐",
            color: "#f1c40f",
            value: 250,
            available: true,
            created_at: new Date().toISOString(),
            description: "A shining star gift", 
            imageUrl: "/assets/gifts/star.png", 
            imageType: "svg",
            hasSound: false,
            soundUrl: "",
            category: "Standard",
            is_premium: false,
          },
        ];
        setGifts(mockGifts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching gifts:", error);
      toast({
        title: "Error",
        description: "Failed to load virtual gifts. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleOpenDialog = (gift?: VirtualGift) => {
    if (gift) {
      setEditingGift(gift);
      setGiftName(gift.name);
      setGiftPrice(gift.price);
      setGiftIcon(gift.icon);
      setGiftColor(gift.color);
      setGiftValue(gift.value);
      setIsAvailable(gift.available);
      setGiftDescription(gift.description);
    } else {
      setEditingGift(null);
      setGiftName("");
      setGiftPrice(0);
      setGiftIcon("");
      setGiftColor("#FFD700");
      setGiftValue(0);
      setIsAvailable(true);
      setGiftDescription("");
    }
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const giftData: VirtualGift = {
        id: editingGift?.id || Date.now().toString(),
        name: giftName,
        price: giftPrice,
        icon: giftIcon,
        color: giftColor,
        value: giftValue,
        available: isAvailable,
        created_at: editingGift?.created_at || new Date().toISOString(),
        description: giftDescription,
        imageUrl: editingGift?.imageUrl || "/assets/gifts/default.png",
        imageType: "svg",
        hasSound: editingGift?.hasSound || false,
        soundUrl: editingGift?.soundUrl || "",
        category: editingGift?.category || "Standard",
        is_premium: editingGift?.is_premium || false,
      };

      if (editingGift) {
        setGifts(gifts.map(g => g.id === editingGift.id ? giftData : g));
        toast({
          title: "Gift Updated",
          description: "The virtual gift has been updated successfully.",
        });
      } else {
        setGifts([...gifts, giftData]);
        toast({
          title: "Gift Created",
          description: "The new virtual gift has been created successfully.",
        });
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Error saving gift:", error);
      toast({
        title: "Error",
        description: "Failed to save virtual gift. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setGifts(gifts.filter(gift => gift.id !== id));
      toast({
        title: "Gift Deleted",
        description: "The virtual gift has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting gift:", error);
      toast({
        title: "Error",
        description: "Failed to delete virtual gift. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Virtual Gifts</h2>
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="border rounded-md">
          <div className="p-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4 py-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Virtual Gifts</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add New Gift
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gift</TableHead>
              <TableHead>Price (Coins)</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gifts.map((gift) => (
              <TableRow key={gift.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="mr-2 text-2xl">{gift.icon}</div>
                    <div>{gift.name}</div>
                  </div>
                </TableCell>
                <TableCell>{gift.price}</TableCell>
                <TableCell>{gift.value}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${gift.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {gift.available ? 'Available' : 'Unavailable'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(gift)} className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(gift.id)} className="text-red-500">
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGift ? 'Edit Gift' : 'Add New Gift'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={giftName}
                onChange={(e) => setGiftName(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input
                id="price"
                type="number"
                value={giftPrice}
                onChange={(e) => setGiftPrice(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={giftIcon}
                onChange={(e) => setGiftIcon(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">Color</Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  value={giftColor}
                  onChange={(e) => setGiftColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  value={giftColor}
                  onChange={(e) => setGiftColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">Value</Label>
              <Input
                id="value"
                type="number"
                value={giftValue}
                onChange={(e) => setGiftValue(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input
                id="description"
                value={giftDescription}
                onChange={(e) => setGiftDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="available" className="text-right">Status</Label>
              <div className="col-span-3">
                <select
                  id="available"
                  value={isAvailable ? "true" : "false"}
                  onChange={(e) => setIsAvailable(e.target.value === "true")}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingGift ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
