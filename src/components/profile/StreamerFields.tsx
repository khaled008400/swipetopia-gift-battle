
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface StreamerFieldsProps {
  form: UseFormReturn<any>;
}

const StreamerFields: React.FC<StreamerFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Streamer Settings</h3>
      
      <FormField
        control={form.control}
        name="stream_key"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stream Key</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                readOnly
                className="font-mono text-sm"
              />
            </FormControl>
            <FormDescription>
              Your unique stream key. Keep this private and do not share it with others.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="streamTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Default Stream Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              This will be used as your default stream title
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="streamDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Default Stream Description</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                rows={3}
              />
            </FormControl>
            <FormDescription>
              This will be shown on your stream page
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StreamerFields;
