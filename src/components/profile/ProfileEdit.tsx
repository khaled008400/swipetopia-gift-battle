
import React, { useState } from 'react';
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

interface ProfileEditProps {
  onComplete: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile(user?.id || null);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    avatar_url: profile?.avatar_url || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let avatarUrl = formValues.avatar_url;

      // Upload avatar if changed
      if (avatarFile) {
        avatarUrl = await UploadService.uploadFile(avatarFile, 'avatars');
      }

      // Update profile
      const result = await updateProfile({
        ...formValues,
        avatar_url: avatarUrl,
      });

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
    onComplete();
  };

  if (!profile) {
    return <div className="text-center py-8 text-gray-400">Loading profile information...</div>;
  }

  return (
    <Card className="bg-app-gray-dark border-0 shadow-md">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-app-yellow">
              <AvatarImage src={avatarPreview || profile.avatar_url || ''} alt={profile.username || 'User'} />
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              className="bg-app-gray-light border-0 focus-visible:ring-app-yellow"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formValues.bio}
              onChange={handleChange}
              className="bg-app-gray-light border-0 focus-visible:ring-app-yellow min-h-[100px]"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formValues.location}
              onChange={handleChange}
              className="bg-app-gray-light border-0 focus-visible:ring-app-yellow"
              placeholder="City, Country"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
