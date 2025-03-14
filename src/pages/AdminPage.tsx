
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import AdminService, { AdminStats } from '@/services/admin.service';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminTabbedInterface from '@/components/admin/AdminTabbedInterface';
import { supabase } from '@/integrations/supabase/client';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (user && isAdmin()) {
      setAdminAuthenticated(true);
    } else {
      setAdminAuthenticated(false);
    }
  }, [user, isAdmin]);

  // Fetch real stats from Supabase
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      try {
        // Get user count
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        // Get new users today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: newUsersToday } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());
        
        // Get video count
        const { count: totalVideos } = await supabase
          .from('short_videos')
          .select('*', { count: 'exact', head: true });
        
        // Get new videos today
        const { count: videoUploadsToday } = await supabase
          .from('short_videos')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());
        
        // Get order count
        const { count: totalOrders } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true });
        
        // Get new orders today
        const { count: ordersToday } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());
        
        // Get revenue data
        const { data: ordersData } = await supabase
          .from('orders')
          .select('total_amount');
        
        const revenueTotal = ordersData?.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0) || 0;
        
        // Get today's revenue
        const { data: todayOrdersData } = await supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', today.toISOString());
        
        const revenueToday = todayOrdersData?.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0) || 0;
        
        return {
          totalUsers: totalUsers || 0,
          newUsersToday: newUsersToday || 0,
          totalVideos: totalVideos || 0,
          videoUploadsToday: videoUploadsToday || 0,
          totalOrders: totalOrders || 0,
          ordersToday: ordersToday || 0,
          revenueTotal,
          revenueToday
        };
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        // Return fallback data on error
        return {
          totalUsers: 0,
          newUsersToday: 0,
          totalVideos: 0,
          videoUploadsToday: 0,
          totalOrders: 0,
          ordersToday: 0,
          revenueTotal: 0,
          revenueToday: 0
        };
      }
    },
    enabled: adminAuthenticated,
    refetchInterval: 60000, // Refresh every minute
  });

  // Redirect non-admin users to the home page
  useEffect(() => {
    if (user && !isAdmin() && !adminAuthenticated) {
      navigate('/');
    }
  }, [user, isAdmin, adminAuthenticated, navigate]);

  // Show login form for unauthenticated users
  if (!user) {
    return <AdminLoginForm onLoginSuccess={() => setAdminAuthenticated(true)} />;
  }

  // Show admin interface for authenticated admins
  if (adminAuthenticated) {
    return <AdminTabbedInterface stats={stats} statsLoading={statsLoading} />;
  }

  // Loading state while checking authentication
  return <div className="flex items-center justify-center h-screen">Loading...</div>;
};

export default AdminPage;
