
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminVideos from '@/components/admin/AdminVideos';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminReports from '@/components/admin/AdminReports';
import ProductAttributes from '@/components/admin/ProductAttributes';
import { useQuery } from '@tanstack/react-query';
import AdminService from '@/services/admin.service';
import { Loader2 } from 'lucide-react';
import AdminCoupons from '@/components/admin/AdminCoupons';
import AdminOffers from '@/components/admin/AdminOffers';
import AdminShipping from '@/components/admin/AdminShipping';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const AdminPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  // Check if user has admin role
  useEffect(() => {
    if (user) {
      // In a real app, you would check if the user has admin permissions
      // For demonstration, we'll consider any logged in user as having admin access
      setAdminAuthenticated(true);
    }
  }, [user]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(username, password);
      setAdminAuthenticated(true);
    } catch (error) {
      console.error("Admin login error:", error);
      toast({
        title: "Admin Access Failed",
        description: "Unable to authenticate for admin access.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Display login form if not authenticated
  if (!user || !adminAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
            <p className="text-gray-500">Login to access admin dashboard</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="admin-username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          
          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-blue-100 rounded-md">
              <p className="text-xs text-blue-600">
                Development mode: If the API is unavailable, you can still log in with any credentials.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Only fetch stats if user is authenticated
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => AdminService.getDashboardStats(),
    refetchInterval: 60000, // Refresh every minute
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage your app's content and users</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-10 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <AdminDashboard stats={stats} />
        </TabsContent>
        
        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
        
        <TabsContent value="videos">
          <AdminVideos />
        </TabsContent>
        
        <TabsContent value="orders">
          <AdminOrders />
        </TabsContent>
        
        <TabsContent value="products">
          <AdminProducts />
        </TabsContent>
        
        <TabsContent value="attributes">
          <ProductAttributes />
        </TabsContent>
        
        <TabsContent value="coupons">
          <AdminCoupons />
        </TabsContent>
        
        <TabsContent value="offers">
          <AdminOffers />
        </TabsContent>
        
        <TabsContent value="shipping">
          <AdminShipping />
        </TabsContent>
        
        <TabsContent value="reports">
          <AdminReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
