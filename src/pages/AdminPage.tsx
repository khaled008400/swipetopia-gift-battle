
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import AdminService, { AdminStats } from '@/services/admin.service';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminTabbedInterface from '@/components/admin/AdminTabbedInterface';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminPage = () => {
  const { user, login, isAdmin, isLoading: authLoading } = useAuth();
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check if user has admin role
  useEffect(() => {
    console.log("Auth state:", { user, isAdmin: isAdmin(), authLoading });
    if (!authLoading) {
      if (user && isAdmin()) {
        console.log("User is admin, setting adminAuthenticated to true");
        setAdminAuthenticated(true);
      } else if (user) {
        console.log("User is not admin:", user);
        setAdminAuthenticated(false);
      }
    }
  }, [user, isAdmin, authLoading]);

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      console.log("Attempting admin login with:", email);
      await login(email, password);
      
      // Check admin status right after login
      if (isAdmin()) {
        console.log("Login successful, user is admin");
        setAdminAuthenticated(true);
        toast({
          title: "Admin access granted",
          description: "Welcome to the admin dashboard",
        });
      } else {
        console.log("Login successful but not admin");
        toast({
          title: "Access denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive"
      });
    }
  };

  // Fetch stats only if user is authenticated as admin
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => AdminService.getDashboardStats(),
    refetchInterval: 60000,
    enabled: !!user && adminAuthenticated,
  });

  const defaultStats = {
    totalUsers: 0,
    newUsersToday: 0,
    totalVideos: 0,
    videoUploadsToday: 0,
    totalOrders: 0,
    ordersToday: 0,
    revenueTotal: 0,
    revenueToday: 0
  };

  // Show loading state only during initial authentication check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }

  // Display login form if not authenticated as admin
  if (!user || !adminAuthenticated) {
    return (
      <AdminLoginForm 
        onLogin={handleAdminLogin} 
        message={user && !isAdmin() ? "You do not have admin privileges" : "Please login with admin credentials"}
      />
    );
  }

  return <AdminTabbedInterface stats={stats || defaultStats} statsLoading={statsLoading} />;
};

export default AdminPage;
