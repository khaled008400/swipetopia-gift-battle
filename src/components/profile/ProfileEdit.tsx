
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile, UserRole } from '@/types/auth.types';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Upload } from 'lucide-react';
import StreamerFields from './StreamerFields';
import WalletSection from './WalletSection';

interface ProfileEditProps {
  onComplete: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ onComplete }) => {
  const { user, hasRole } = useAuth();
  const userId = user?.id || '';
  const { profile, updateProfile, isLoading } = useUserProfile(userId);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const formSchema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    bio: z.string().optional(),
    location: z.string().optional(),
    interests: z.string().optional(),
    shop_name: z.string().optional(),
    stream_key: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      bio: '',
      location: '',
      interests: '',
      shop_name: '',
      stream_key: '',
    }
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        interests: profile.interests ? profile.interests.join(', ') : '',
        shop_name: profile.shop_name || '',
        stream_key: profile.stream_key || '',
      });
      
      if (profile.avatar_url) {
        setAvatarPreview(profile.avatar_url);
      }
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!profile) return;
    
    try {
      setSubmitting(true);
      
      // Process interests from comma-separated string to array
      const interestsArray = data.interests ? 
        data.interests.split(',').map(i => i.trim()).filter(Boolean) : 
        undefined;

      const updateData: Partial<UserProfile> = {
        ...data,
        interests: interestsArray,
      };

      const { success } = await updateProfile(updateData);
      if (success) {
        onComplete();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isStreamer = hasRole ? hasRole('streamer') : false;
  const isSeller = hasRole ? hasRole('seller') : false;

  if (!profile && isLoading) {
    return (
      <div className="w-full p-8 flex justify-center items-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full p-8 text-center">
        <h3 className="text-lg font-medium">Profile Not Found</h3>
        <p className="text-gray-500 mt-2">Unable to load profile information.</p>
        <Button onClick={onComplete} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              {isStreamer && <TabsTrigger value="streaming">Streaming</TabsTrigger>}
              {isSeller && <TabsTrigger value="seller">Seller</TabsTrigger>}
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={avatarPreview || ''} />
                    <AvatarFallback>
                      {profile.username?.charAt(0).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" type="button" asChild>
                      <label>
                        <Upload className="h-4 w-4 mr-2" />
                        Change Avatar
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </Button>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself" 
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Fashion, Tech, Gaming, etc. (comma separated)" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your interests separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </TabsContent>
            
            {isStreamer && (
              <TabsContent value="streaming">
                <CardContent className="space-y-4">
                  <StreamerFields form={form} />
                </CardContent>
              </TabsContent>
            )}
            
            {isSeller && (
              <TabsContent value="seller">
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="shop_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shop Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your shop name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Additional seller fields could go here */}
                </CardContent>
              </TabsContent>
            )}
            
            <TabsContent value="wallet">
              <CardContent>
                {profile && <WalletSection profile={profile} />}
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-between border-t p-4 mt-4">
            <Button 
              variant="outline" 
              onClick={onComplete}
              type="button"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || submitting}
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProfileEdit;
