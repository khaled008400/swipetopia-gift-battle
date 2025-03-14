
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import AdminService, { AdminStats } from '@/services/admin.service';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminTabbedInterface from '@/components/admin/AdminTabbedInterface';

const AdminPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  // Check if user has admin role
  useEffect(() => {
    if (user) {
      // In a real app, you would check if the user has admin permissions
      // For demonstration, we'll consider any logged in user as having admin access
      setAdminAuthenticated(true);
    }
  }, [user]);

  const handleAdminLogin = async (username: string, password: string) => {
    await login(username, password);
    setAdminAuthenticated(true);
  };

  // Fetch stats only if user is authenticated
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => AdminService.getDashboardStats(),
    refetchInterval: 60000, // Refresh every minute
    enabled: !!user && adminAuthenticated, // Only run query if user is authenticated
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

  // Display login form if not authenticated
  if (!user || !adminAuthenticated) {
    return <AdminLoginForm onLogin={handleAdminLogin} />;
  }

  // Pass either the actual stats or the default stats
  return <AdminTabbedInterface stats={stats || defaultStats} statsLoading={statsLoading} />;
};

export default AdminPage;
