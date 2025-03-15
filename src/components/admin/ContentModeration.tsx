
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminVideos from './AdminVideos';
import AdminProducts from './AdminProducts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ContentModeration = () => {
  const [activeTab, setActiveTab] = useState('videos');
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error("Error checking admin status:", error);
          return;
        }
        
        if (data?.role === 'admin') {
          setIsAdmin(true);
        } else {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this area",
            variant: "destructive",
          });
        }
      }
    };
    
    checkAdminStatus();
  }, [toast]);

  if (!isAdmin) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p className="mb-4">You need administrator privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Moderation</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="users">User Content</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos" className="space-y-4">
          <AdminVideos />
        </TabsContent>
        
        <TabsContent value="comments" className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="text-lg font-medium mb-2">Comment Moderation</h3>
            <p className="text-gray-500">Manage user comments and interactions</p>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="text-lg font-medium mb-2">User Content</h3>
            <p className="text-gray-500">Manage user profiles and content</p>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <AdminProducts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentModeration;
