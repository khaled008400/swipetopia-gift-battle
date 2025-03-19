
import React, { useState, useEffect, useCallback } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import UploadService from '@/services/upload.service';
import { useToast } from '@/components/ui/use-toast';

// Debug render counter
let renderCount = 0;

interface ProfileEditProps {
  onComplete: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ onComplete }) => {
  renderCount++;
  console.log(`ProfileEdit render #${renderCount}`);
  
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile(user?.id || null);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: '',
    bio: '',
    location: '',
    avatar_url: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Debug form state changes
  useEffect(() => {
    console.log('ProfileEdit formValues updated:', formValues);
  }, [formValues]);

  // Debug avatar file changes
  useEffect(() => {
    console.log('Avatar file changed:', avatarFile?.name || 'null');
  }, [avatarFile]);

  // Update form values when profile is loaded
  useEffect(() => {
    if (profile) {
      console.log('ProfileEdit: Setting form values from profile:', {
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || '',
      });
      
      setFormValues({
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('Field changed:', name, value);
    setFormValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('New avatar file selected:', file.name, file.type, file.size);
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Avatar preview created');
        setAvatarPreview(reader.result as string);
      };
      reader.onerror = () => {
        console.error('Error creating avatar preview');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profile form submitted with values:', formValues);
    setIsLoading(true);

    try {
      let avatarUrl = formValues.avatar_url;

      // Upload avatar if changed
      if (avatarFile) {
        console.log('Uploading new avatar file');
        try {
          avatarUrl = await UploadService.uploadFile(avatarFile, 'avatars');
          console.log('Avatar uploaded successfully, new URL:', avatarUrl);
        } catch (avatarError) {
          console.error('Avatar upload failed:', avatarError);
          toast({
            title: "Avatar Upload Failed",
            description: "Your profile will be updated without the new avatar.",
            variant: "destructive",
          });
        }
      }

      // Update profile
      console.log('Updating profile with data:', {
        ...formValues,
        avatar_url: avatarUrl,
      });
      
      const result = await updateProfile({
        ...formValues,
        avatar_url: avatarUrl,
      });

      console.log('Profile update result:', result);

      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
          variant: "default",
        });
        onComplete();
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Edit canceled');
    onComplete();
  };

  if (!profile) {
    console.log('ProfileEdit: No profile available, showing loading state');
    return (
      <div className="text-center py-8 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-app-yellow" />
        Loading profile information...
      </div>
    );
  }

  console.log('ProfileEdit: Rendering form');
  
  return (
    <Card className="bg-app-gray-dark border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-white">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-app-yellow">
              <AvatarImage 
                src={avatarPreview || profile.avatar_url || ''} 
                alt={profile.username || 'User'} 
                onError={() => console.log('Avatar image failed to load')}
              />
              <AvatarFallback className="text-2xl bg-app-gray-light text-app-yellow">
                {profile.username ? profile.username.charAt(0).toUpperCase() : '?'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex items-center">
              <Label htmlFor="avatar-upload" className="cursor-pointer bg-app-gray-light hover:bg-app-gray text-app-yellow px-4 py-2 rounded-l-md flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Label>
              <Input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden"
              />
              <span className="bg-app-gray-light px-4 py-2 rounded-r-md text-gray-400 text-sm truncate max-w-[150px]">
                {avatarFile ? avatarFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white">Username</Label>
            <Input
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              className="bg-app-gray-light border-0 focus-visible:ring-app-yellow text-white"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-white">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formValues.bio}
              onChange={handleChange}
              className="bg-app-gray-light border-0 focus-visible:ring-app-yellow min-h-[100px] text-white"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-white">Location</Label>
            <Input
              id="location"
              name="location"
              value={formValues.location}
              onChange={handleChange}
              className="bg-app-gray-light border-0 focus-visible:ring-app-yellow text-white"
              placeholder="City, Country"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              value={profile.email || ''}
              disabled
              className="bg-app-gray-light/50 border-0 text-gray-400"
            />
            <p className="text-xs text-gray-400">Email cannot be changed</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="border-app-yellow text-app-yellow hover:bg-app-yellow hover:text-app-black"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-app-yellow text-app-black hover:bg-app-yellow/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEdit;
