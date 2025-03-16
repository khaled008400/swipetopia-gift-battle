
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AdminService, { AdminStats } from '@/services/admin.service';
import AdminTabbedInterface from '@/components/admin/AdminTabbedInterface';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { toast } = useToast();

  // For debugging
  console.log("Admin Dashboard - User:", user);
  console.log("Admin Dashboard - Is Admin:", isAdmin());

  // Define mock stats for development
  const mockStats: AdminStats = {
    totalUsers: 12543,
    newUsersToday: 72,
    totalVideos: 45280,
    videoUploadsToday: 142,
    totalOrders: 8753,
    ordersToday: 53,
    revenueTotal: 392150,
    revenueToday: 2750
  };

  // Fetch dashboard stats with fallback to mock data
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      try {
        console.log("Fetching admin stats...");
        const data = await AdminService.getDashboardStats();
        console.log("Admin stats received:", data);
        return data;
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        // Return mock data if the real API fails
        return mockStats;
      }
    },
    enabled: !!user, // Only fetch if user is logged in
    initialData: mockStats // Use mock stats as initial data
  });

  // Check if user is authorized as admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (user && isAdmin()) {
        console.log("User authorized as admin");
        setIsAuthorized(true);
      } else {
        console.log("User not authorized as admin");
        setIsAuthorized(false);
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel",
          variant: "destructive"
        });
      }
    };

    checkAdminAccess();
  }, [user, isAdmin, toast]);

  // Loading state while checking authorization
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-app-black text-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-app-yellow" />
          <p>Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authorized
  if (isAuthorized === false) {
    return <Navigate to="/" replace />;
  }

  console.log("Rendering AdminTabbedInterface with stats:", stats);

  // Admin dashboard with tabs
  return (
    <div className="bg-app-black min-h-screen">
      <AdminTabbedInterface 
        stats={stats || mockStats} 
        statsLoading={isLoading}
      />
    </div>
  );
};

export default AdminDashboardPage;
