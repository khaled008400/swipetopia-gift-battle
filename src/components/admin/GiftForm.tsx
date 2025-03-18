
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import UploadService from '@/services/upload.service';
import { VirtualGift } from '@/types/gift.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GiftFormProps {
  initialData: VirtualGift | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const GiftForm: React.FC<GiftFormProps> = ({ initialData, onSubmit, onCancel, mode }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 100,
      category: initialData?.category || 'standard',
      available: initialData?.available !== undefined ? initialData.available : true,
      hasSound: initialData?.hasSound || initialData?.has_sound || false,
      imageUrl: initialData?.imageUrl || initialData?.image_url || '',
      imageType: initialData?.imageType || initialData?.image_type || 'gif',
      soundUrl: initialData?.soundUrl || initialData?.sound_url || '' // Include soundUrl
    }
  });
  
  const hasSound = watch('hasSound');
  const imageUrl = watch('imageUrl');
  const soundUrl = watch('soundUrl');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  
  const handleSoundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSoundFile(e.target.files[0]);
    }
  };

  const onFormSubmit = async (data: any) => {
    try {
      setLoading(true);
      
      // Upload image if selected
      if (imageFile) {
        const imageUrl = await UploadService.uploadIcon(imageFile);
        data.imageUrl = imageUrl;
        // Set the image type based on file extension
        const fileExt = imageFile.name.split('.').pop()?.toLowerCase();
        data.imageType = fileExt === 'svg' ? 'svg' : 'gif';
      }
      
      // Upload sound if enabled and selected
      if (hasSound && soundFile) {
        const soundUrl = await UploadService.uploadAudio(soundFile);
        data.soundUrl = soundUrl;
      }
      
      // Pass the data to parent component
      onSubmit(data);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Gift Name</Label>
        <Input 
          id="name" 
          {...register('name', { required: true })} 
          placeholder="Enter gift name"
          disabled={loading}
        />
        {errors.name && <p className="text-sm text-red-500">Gift name is required</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          {...register('description')} 
          placeholder="Enter gift description (optional)"
          disabled={loading}
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Price (Coins)</Label>
        <Input 
          id="price" 
          type="number" 
          {...register('price', { required: true, min: 1 })} 
          disabled={loading}
        />
        {errors.price && <p className="text-sm text-red-500">Price must be a positive number</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          defaultValue={initialData?.category || 'standard'} 
          onValueChange={(value) => setValue('category', value)}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="special">Special</SelectItem>
            <SelectItem value="animated">Animated</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Gift Image</Label>
        {imageUrl ? (
          <div className="border rounded-md p-3 flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={imageUrl} 
                alt="Gift preview" 
                className="w-12 h-12 object-contain mr-3"
              />
              <span className="text-sm">Current image</span>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => setValue('imageUrl', '')}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border border-dashed rounded-md p-6 flex flex-col items-center">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload a GIF or SVG image for your gift
            </p>
            <Input 
              id="image" 
              type="file" 
              accept=".gif,.svg,image/gif,image/svg+xml" 
              onChange={handleImageChange}
              disabled={loading}
              className="max-w-xs"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between border p-3 rounded-md">
        <div className="flex items-center space-x-2">
          <Label htmlFor="hasSound" className="cursor-pointer">
            Enable Sound
          </Label>
          <Switch 
            id="hasSound" 
            checked={hasSound}
            onCheckedChange={(checked) => setValue('hasSound', checked)}
            disabled={loading}
          />
        </div>
      </div>
      
      {hasSound && (
        <div className="space-y-2">
          <Label htmlFor="sound">Gift Sound</Label>
          {soundUrl ? (
            <div className="border rounded-md p-3 flex items-center justify-between">
              <div className="flex items-center">
                <audio controls src={soundUrl} className="h-8 mr-3" />
                <span className="text-sm">Current sound</span>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => setValue('soundUrl', '')}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border border-dashed rounded-md p-6 flex flex-col items-center">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload an MP3 or WAV sound for your gift
              </p>
              <Input 
                id="sound" 
                type="file" 
                accept=".mp3,.wav,audio/mpeg,audio/wav" 
                onChange={handleSoundChange}
                disabled={loading}
                className="max-w-xs"
              />
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between border p-3 rounded-md">
          <Label htmlFor="available" className="cursor-pointer">
            Available for Purchase
          </Label>
          <Switch 
            id="available" 
            {...register('available')}
            checked={watch('available')}
            onCheckedChange={(checked) => setValue('available', checked)}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'create' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            mode === 'create' ? 'Create Gift' : 'Update Gift'
          )}
        </Button>
      </div>
    </form>
  );
};

export default GiftForm;
