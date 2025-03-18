
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { VirtualGift } from '@/types/gift.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';
import UploadService from '@/services/upload.service';
import { useToast } from '@/components/ui/use-toast';

interface GiftFormProps {
  initialData?: VirtualGift | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

const GiftForm: React.FC<GiftFormProps> = ({ 
  initialData, 
  onSubmit,
  onCancel,
  mode 
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      category: initialData?.category || 'basic',
      available: initialData?.available !== undefined ? initialData.available : true,
      hasSound: initialData?.hasSound || initialData?.has_sound || false,
      imageUrl: initialData?.imageUrl || initialData?.image_url || '',
      imageType: initialData?.imageType || initialData?.image_type || 'gif'
    }
  });

  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const { toast } = useToast();

  const hasSound = watch('hasSound');
  const imageUrl = watch('imageUrl');

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        setImageFile(file);
        setIsUploading(true);
        
        const uploadedUrl = await UploadService.uploadIcon(file);
        setValue('imageUrl', uploadedUrl);
        
        toast({
          title: "Image uploaded",
          description: "Icon has been uploaded successfully."
        });
      } catch (error) {
        console.error("Error uploading icon:", error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading the icon.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSoundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        setAudioFile(file);
        setIsUploading(true);
        
        const uploadedUrl = await UploadService.uploadAudio(file);
        setValue('soundUrl', uploadedUrl);
        
        toast({
          title: "Sound uploaded",
          description: "Sound effect has been uploaded successfully."
        });
      } catch (error) {
        console.error("Error uploading sound:", error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading the sound effect.",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onFormSubmit = async (data: any) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Gift Name</Label>
        <Input 
          id="name"
          {...register('name', { required: "Gift name is required" })}
          placeholder="Heart, Diamond, etc."
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          {...register('description')}
          placeholder="Brief description of this gift"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (coins)</Label>
          <Input 
            id="price"
            type="number"
            {...register('price', { 
              required: "Price is required",
              min: { value: 1, message: "Price must be at least 1" }
            })}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            defaultValue={initialData?.category || 'basic'}
            onValueChange={(value) => setValue('category', value)}
          >
            <SelectTrigger id="category">
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUpload">Gift Icon</Label>
        
        <div className="flex items-center gap-4">
          {imageUrl && (
            <div className="h-20 w-20 rounded border p-1 flex items-center justify-center bg-gray-50">
              <img 
                src={imageUrl} 
                alt="Gift icon" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
          
          <div>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleIconUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('imageUpload')?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {imageUrl ? 'Change Icon' : 'Upload Icon'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="hasSound"
          checked={hasSound}
          onCheckedChange={(checked) => setValue('hasSound', checked)}
        />
        <Label htmlFor="hasSound">Has Sound Effect</Label>
      </div>

      {hasSound && (
        <div className="space-y-2 pl-6">
          <Label htmlFor="soundUpload">Sound Effect</Label>
          <div>
            <Input
              id="soundUpload"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleSoundUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('soundUpload')?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Sound
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={watch('available')}
          onCheckedChange={(checked) => setValue('available', checked)}
        />
        <Label htmlFor="available">Available to Purchase</Label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isUploading}>
          {mode === 'create' ? 'Create Gift' : 'Update Gift'}
        </Button>
      </div>
    </form>
  );
};

export default GiftForm;
