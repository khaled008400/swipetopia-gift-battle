
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Camera, LoaderCircle, Store, Video } from "lucide-react";
import { UserProfile } from "@/types/auth.types";
import { useUserProfile } from "@/hooks/useUserProfile";

// Profile validation schema
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().optional(),
  location: z.string().optional(),
  interests: z.string().optional(),
  shop_name: z.string().optional(),
  stream_key: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditProps {
  onComplete?: () => void;
}

const ProfileEdit = ({ onComplete }: ProfileEditProps) => {
  const { user: authUser, hasRole } = useAuth();
  const { profile, updateProfile } = useUserProfile(authUser || null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);

  // Initialize form with current user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      interests: profile?.interests ? profile.interests.join(", ") : "",
      shop_name: profile?.shop_name || "",
      stream_key: profile?.stream_key || "",
    },
  });

  // Update form when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        interests: profile.interests ? profile.interests.join(", ") : "",
        shop_name: profile.shop_name || "",
        stream_key: profile.stream_key || "",
      });
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      // Process interests from comma-separated string to array
      const interestsArray = values.interests 
        ? values.interests.split(',').map(i => i.trim()).filter(i => i.length > 0)
        : undefined;

      // Upload avatar if changed
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${profile.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, avatarFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }

      // Update profile using the hook
      const result = await updateProfile({
        username: values.username,
        avatar_url: avatarUrl,
        bio: values.bio,
        location: values.location,
        interests: interestsArray,
        shop_name: hasRole("seller") ? values.shop_name : undefined,
        stream_key: hasRole("streamer") ? values.stream_key : undefined,
      });

      if (result.success && onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="w-full max-w-md mx-auto pb-8">
      <div className="mb-6 flex flex-col items-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-app-gray-dark mb-2 bg-app-gray-light">
          <img
            src={avatarPreview || "https://via.placeholder.com/150"}
            alt={profile.username}
            className="w-full h-full object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-app-yellow text-app-black p-1 rounded-full cursor-pointer">
            <Camera className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Profile Fields */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
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
                  <Textarea placeholder="Tell us about yourself" {...field} />
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
                <FormLabel>Interests (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="music, travel, gaming" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditional Fields Based on Roles */}
          {hasRole("seller") && (
            <div className="pt-2 border-t border-app-gray-light">
              <h3 className="text-lg font-medium flex items-center mb-3">
                <Store className="w-5 h-5 mr-2 text-green-500" />
                Seller Profile
              </h3>

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
            </div>
          )}

          {hasRole("streamer") && (
            <div className="pt-2 border-t border-app-gray-light">
              <h3 className="text-lg font-medium flex items-center mb-3">
                <Video className="w-5 h-5 mr-2 text-purple-500" />
                Streamer Profile
              </h3>

              <FormField
                control={form.control}
                name="stream_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stream Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Stream key" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button type="submit" className="w-full bg-app-yellow text-app-black" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Profile
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEdit;
