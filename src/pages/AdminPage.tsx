
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
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user has admin role
  useEffect(() => {
    console.log("AdminPage: Auth state check:", { 
      user, 
      isAdmin: user ? isAdmin() : false, 
      authLoading 
    });
    
    if (!authLoading) {
      if (user) {
        const hasAdminRole = isAdmin();
        console.log("AdminPage: Admin check result:", hasAdminRole);
        
        if (hasAdminRole) {
          console.log("AdminPage: User is admin, setting adminAuthenticated to true");
          setAdminAuthenticated(true);
        } else {
          console.log("AdminPage: User is not admin:", user);
          setAdminAuthenticated(false);
        }
      } else {
        console.log("AdminPage: No user found, not admin");
        setAdminAuthenticated(false);
      }
    }
  }, [user, isAdmin, authLoading]);

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      setIsProcessing(true);
      console.log("AdminPage: Attempting admin login with:", email);
      const result = await login(email, password);
      console.log("AdminPage: Login result:", result);
      
      // Check admin status after login
      if (result && result.user) {
        // Small delay to ensure user state is updated properly
        setTimeout(() => {
          const isUserAdmin = isAdmin();
          console.log("AdminPage: After login, is user admin?", isUserAdmin);
          
          if (isUserAdmin) {
            console.log("AdminPage: Setting adminAuthenticated to true");
            setAdminAuthenticated(true);
            toast({
              title: "Admin access granted",
              description: "Welcome to the admin dashboard",
            });
          } else {
            console.log("AdminPage: User is not admin after login");
            toast({
              title: "Access denied",
              description: "You don't have admin privileges",
              variant: "destructive"
            });
          }
          setIsProcessing(false);
        }, 500);
      } else {
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("AdminPage: Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive"
      });
      setIsProcessing(false);
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

  console.log("AdminPage: Render state:", {
    authLoading,
    isProcessing,
    user: !!user,
    adminAuthenticated,
    statsLoading
  });

  // Show loading state only during initial authentication check
  if (authLoading || isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">
          {isProcessing ? "Verifying admin access..." : "Checking authentication..."}
        </span>
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
