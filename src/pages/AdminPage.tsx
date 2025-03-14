
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import AdminService, { AdminStats } from '@/services/admin.service';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminTabbedInterface from '@/components/admin/AdminTabbedInterface';
import { Loader2 } from 'lucide-react';

const AdminPage = () => {
  const { user, login, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  // Check if user has admin role
  useEffect(() => {
    if (user && isAdmin()) {
      setAdminAuthenticated(true);
    } else if (user && !isAdmin()) {
      // If user is logged in but not an admin, show a message
      console.log("User is not an admin");
      setAdminAuthenticated(false);
    }
  }, [user, isAdmin]);

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // The useEffect above will check if the user is an admin after login
    } catch (error) {
      console.error("Admin login error:", error);
    }
  };

  // Fetch stats only if user is authenticated as admin
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => AdminService.getDashboardStats(),
    refetchInterval: 60000, // Refresh every minute
    enabled: !!user && adminAuthenticated, // Only run query if user is admin
  });

  // Create default stats object to avoid undefined errors
  const defaultStats: AdminStats = {
    totalUsers: 0,
    newUsersToday: 0,
    totalVideos: 0,
    videoUploadsToday: 0,
    totalOrders: 0,
    ordersToday: 0,
    revenueTotal: 0,
    revenueToday: 0
  };

  // Show loading state while we check authentication
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

  // Pass either the actual stats or the default stats
  return <AdminTabbedInterface stats={stats || defaultStats} statsLoading={statsLoading} />;
};

export default AdminPage;
