
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import AdminService, { AdminStats } from '@/services/admin.service';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminTabbedInterface from '@/components/admin/AdminTabbedInterface';

const AdminPage = () => {
  const { user, login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  // Check if user has admin role
  useEffect(() => {
    console.log("Current user in AdminPage:", user);
    if (user && isAdmin()) {
      console.log("User is admin, setting adminAuthenticated to true");
      setAdminAuthenticated(true);
    } else if (user && !isAdmin()) {
      // If user is logged in but not an admin, show a message
      console.log("User is not an admin");
      setAdminAuthenticated(false);
    }
  }, [user, isAdmin]);

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      console.log("Attempting admin login with email:", email);
      await login(email, password);
      // The useEffect above will check if the user is an admin after login
    } catch (error) {
      console.error("Admin login error:", error);
    }
  };

  // Fetch stats only if user is authenticated as admin
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => {
      console.log("Fetching admin stats...");
      // Using mock data for development since the API endpoint might not exist
      if (import.meta.env.DEV) {
        console.log("Using mock admin stats for development");
        return {
          totalUsers: 250,
          newUsersToday: 15,
          totalVideos: 1200,
          videoUploadsToday: 35,
          totalOrders: 320,
          ordersToday: 12,
          revenueTotal: 15750,
          revenueToday: 780
        };
      }
      return AdminService.getDashboardStats();
    },
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

  // Display login form if not authenticated as admin
  if (!user || !adminAuthenticated) {
    return (
      <AdminLoginForm 
        onLogin={handleAdminLogin} 
        message={user && !isAdmin() ? "You do not have admin privileges" : "Please login with admin credentials"}
      />
    );
  }

  console.log("Rendering admin interface with stats:", stats || defaultStats);
  // Pass either the actual stats or the default stats
  return <AdminTabbedInterface stats={stats || defaultStats} statsLoading={statsLoading} />;
};

export default AdminPage;
