
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { VirtualGift } from '@/services/streaming/stream.types';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// Define the gift schema
const giftSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().min(1, "Price must be at least 1"),
  imageUrl: z.string().url("Must be a valid URL"),
  imageType: z.enum(["gif", "svg"]),
  hasSound: z.boolean(),
  soundUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  category: z.string().min(1, "Category is required"),
  available: z.boolean()
});

export type GiftFormData = z.infer<typeof giftSchema>;

interface GiftFormProps {
  initialData?: VirtualGift | null;
  onSubmit: (data: GiftFormData) => void;
  mode: 'create' | 'edit';
}

const GiftForm: React.FC<GiftFormProps> = ({ initialData, onSubmit, mode }) => {
  const [hasSound, setHasSound] = useState(initialData?.hasSound || false);

  const form = useForm<GiftFormData>({
    resolver: zodResolver(giftSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || '',
      price: initialData.price,
      imageUrl: initialData.imageUrl,
      imageType: initialData.imageType as "gif" | "svg",
      hasSound: initialData.hasSound,
      soundUrl: initialData.soundUrl || '',
      category: initialData.category,
      available: initialData.available
    } : {
      name: '',
      description: '',
      price: 50,
      imageUrl: '',
      imageType: 'gif',
      hasSound: false,
      soundUrl: '',
      category: 'general',
      available: true
    }
  });

  const handleSoundToggle = (checked: boolean) => {
    setHasSound(checked);
    form.setValue('hasSound', checked);
    if (!checked) {
      form.setValue('soundUrl', '');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gift Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (coins)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="celebration">Celebration</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="cute">Cute</SelectItem>
                    <SelectItem value="funny">Funny</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>URL to the gif or svg file</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Type</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an image type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gif">GIF</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasSound"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Include Sound</FormLabel>
                <FormDescription>
                  Enable sound effect for this gift
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => handleSoundToggle(checked)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {hasSound && (
          <FormField
            control={form.control}
            name="soundUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sound URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>URL to a sound file (mp3, wav)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Available for Users</FormLabel>
                <FormDescription>
                  Make this gift available for users to purchase
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
            {mode === 'create' ? 'Create Gift' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default GiftForm;
