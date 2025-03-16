
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, Save } from "lucide-react";
import { ShopProfile } from "@/types/product.types"; 
import { supabase } from "@/lib/supabase";

const ShopProfileEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  
  const [profile, setProfile] = useState<ShopProfile>({
    id: "",
    user_id: user?.id || "",
    name: "",
    description: "",
    logo_url: "",
    banner_url: "",
    contact_email: "",
    contact_phone: "",
    social_links: {
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    policies: {
      returns: "",
      shipping: "",
      terms: "",
    },
  });

  useEffect(() => {
    if (user?.id) {
      fetchShopProfile();
    }
  }, [user]);

  const fetchShopProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shop_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // No rows error code
          toast({
            title: "Error fetching shop profile",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof ShopProfile],
          [field]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (type === 'logo') {
        setLogoUploading(true);
      } else {
        setBannerUploading(true);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}_${type}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `shop_assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('shops')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('shops')
        .getPublicUrl(filePath);

      if (type === 'logo') {
        setProfile(prev => ({ ...prev, logo_url: urlData.publicUrl }));
      } else {
        setProfile(prev => ({ ...prev, banner_url: urlData.publicUrl }));
      }

      toast({
        title: "Upload successful",
        description: `${type === 'logo' ? 'Logo' : 'Banner'} has been uploaded.`,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      if (type === 'logo') {
        setLogoUploading(false);
      } else {
        setBannerUploading(false);
      }
    }
  };

  const saveProfile = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // Check if profile exists
      const { count, error: countError } = await supabase
        .from('shop_profiles')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id);
      
      if (countError) throw countError;

      // Update profile with current date
      const updatedProfile = {
        ...profile,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };
      
      if (count && count > 0) {
        // Update existing profile
        const { error } = await supabase
          .from('shop_profiles')
          .update(updatedProfile)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('shop_profiles')
          .insert({
            ...updatedProfile,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }

      toast({
        title: "Shop profile saved",
        description: "Your shop profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shop Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shop Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={profile.name || ""} 
                  onChange={handleChange} 
                  placeholder="Your shop name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Shop Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={profile.description || ""}
                  onChange={handleChange}
                  placeholder="Describe your shop"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Shop Logo</Label>
                {profile.logo_url && (
                  <div className="w-32 h-32 mb-2 rounded-lg overflow-hidden">
                    <img 
                      src={profile.logo_url} 
                      alt="Shop Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center">
                  <Label 
                    htmlFor="logo-upload" 
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-app-gray-dark rounded-md hover:bg-gray-700"
                  >
                    {logoUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Upload Logo
                  </Label>
                  <Input 
                    id="logo-upload" 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    disabled={logoUploading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Shop Banner</Label>
                {profile.banner_url && (
                  <div className="w-full h-32 mb-2 rounded-lg overflow-hidden">
                    <img 
                      src={profile.banner_url} 
                      alt="Shop Banner" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center">
                  <Label 
                    htmlFor="banner-upload" 
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-app-gray-dark rounded-md hover:bg-gray-700"
                  >
                    {bannerUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    Upload Banner
                  </Label>
                  <Input 
                    id="banner-upload" 
                    type="file" 
                    accept="image/*"
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, 'banner')}
                    disabled={bannerUploading}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input 
                  id="contact_email" 
                  name="contact_email" 
                  value={profile.contact_email || ""} 
                  onChange={handleChange} 
                  placeholder="Contact email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input 
                  id="contact_phone" 
                  name="contact_phone" 
                  value={profile.contact_phone || ""} 
                  onChange={handleChange} 
                  placeholder="Contact phone"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              
              <div className="space-y-2">
                <Label htmlFor="social_links.website">Website</Label>
                <Input 
                  id="social_links.website" 
                  name="social_links.website" 
                  value={profile.social_links?.website || ""} 
                  onChange={handleChange} 
                  placeholder="Your website URL"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="social_links.facebook">Facebook</Label>
                <Input 
                  id="social_links.facebook" 
                  name="social_links.facebook" 
                  value={profile.social_links?.facebook || ""} 
                  onChange={handleChange} 
                  placeholder="Facebook profile URL"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="social_links.instagram">Instagram</Label>
                <Input 
                  id="social_links.instagram" 
                  name="social_links.instagram" 
                  value={profile.social_links?.instagram || ""} 
                  onChange={handleChange} 
                  placeholder="Instagram profile URL"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="social_links.twitter">Twitter</Label>
                <Input 
                  id="social_links.twitter" 
                  name="social_links.twitter" 
                  value={profile.social_links?.twitter || ""} 
                  onChange={handleChange} 
                  placeholder="Twitter profile URL"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Shop Policies</h3>
            
            <div className="space-y-2">
              <Label htmlFor="policies.returns">Return Policy</Label>
              <Textarea 
                id="policies.returns" 
                name="policies.returns"
                value={profile.policies?.returns || ""}
                onChange={handleChange}
                placeholder="Your return policy"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policies.shipping">Shipping Policy</Label>
              <Textarea 
                id="policies.shipping" 
                name="policies.shipping"
                value={profile.policies?.shipping || ""}
                onChange={handleChange}
                placeholder="Your shipping policy"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policies.terms">Terms and Conditions</Label>
              <Textarea 
                id="policies.terms" 
                name="policies.terms"
                value={profile.policies?.terms || ""}
                onChange={handleChange}
                placeholder="Your terms and conditions"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={saveProfile} 
              disabled={saving}
              className="bg-app-yellow text-app-black hover:bg-yellow-500"
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopProfileEditor;
