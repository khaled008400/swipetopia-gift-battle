
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import AdminService from '@/services/admin.service';
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

  // Display login form if not authenticated
  if (!user || !adminAuthenticated) {
    return <AdminLoginForm onLogin={handleAdminLogin} />;
  }

  return <AdminTabbedInterface stats={stats || {}} statsLoading={statsLoading} />;
};

export default AdminPage;
