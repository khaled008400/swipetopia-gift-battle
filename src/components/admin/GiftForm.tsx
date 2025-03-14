
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VirtualGift } from '@/services/admin.service';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GiftFormProps {
  initialData: VirtualGift | null;
  onSubmit: (data: Partial<Omit<VirtualGift, 'id' | 'createdAt'>>) => void;
  onCancel: () => void;
}

const GiftForm = ({ initialData, onSubmit, onCancel }: GiftFormProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      category: 'general',
      imageUrl: '',
      imageType: 'svg',
      hasSound: false,
      soundUrl: '',
      available: true
    }
  });

  // Set up form values based on initialData
  React.useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'createdAt') {
          setValue(key as any, value);
        }
      });
    }
  }, [initialData, setValue]);

  const hasSound = watch('hasSound');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            className="col-span-3"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price
          </Label>
          <Input
            id="price"
            type="number"
            className="col-span-3"
            {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })}
          />
          {errors.price && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.price.message}</p>}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            className="col-span-3"
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
          <Select
            defaultValue={initialData?.category || 'general'}
            onValueChange={(value) => setValue('category', value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="celebration">Celebration</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="cute">Cute</SelectItem>
              <SelectItem value="funny">Funny</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="imageUrl" className="text-right">
            Image URL
          </Label>
          <Input
            id="imageUrl"
            className="col-span-3"
            {...register('imageUrl', { required: 'Image URL is required' })}
          />
          {errors.imageUrl && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.imageUrl.message}</p>}
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="imageType" className="text-right">
            Image Type
          </Label>
          <Select
            defaultValue={initialData?.imageType || 'svg'}
            onValueChange={(value) => setValue('imageType', value as 'svg' | 'gif')}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select image type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="svg">SVG</SelectItem>
              <SelectItem value="gif">GIF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="hasSound" className="text-right">
            Has Sound
          </Label>
          <div className="col-span-3 flex items-center space-x-2">
            <Switch
              id="hasSound"
              checked={hasSound}
              onCheckedChange={(checked) => setValue('hasSound', checked)}
            />
            <Label htmlFor="hasSound">{hasSound ? 'Yes' : 'No'}</Label>
          </div>
        </div>

        {hasSound && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="soundUrl" className="text-right">
              Sound URL
            </Label>
            <Input
              id="soundUrl"
              className="col-span-3"
              {...register('soundUrl', { required: hasSound ? 'Sound URL is required when Has Sound is enabled' : false })}
            />
            {errors.soundUrl && <p className="text-red-500 text-sm col-span-3 col-start-2">{errors.soundUrl.message}</p>}
          </div>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="available" className="text-right">
            Available
          </Label>
          <div className="col-span-3 flex items-center space-x-2">
            <Switch
              id="available"
              checked={watch('available')}
              onCheckedChange={(checked) => setValue('available', checked)}
            />
            <Label htmlFor="available">{watch('available') ? 'Yes' : 'No'}</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Gift' : 'Create Gift'}
        </Button>
      </div>
    </form>
  );
};

export default GiftForm;
