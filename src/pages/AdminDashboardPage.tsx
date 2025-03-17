
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AdminService, { AdminStats } from '@/services/admin.service';
import AdminTabbedInterface from '@/components/admin/AdminTabbedInterface';
import { useToast } from '@/components/ui/use-toast';
import AuthCheck from '@/components/auth/AuthCheck';

const AdminDashboardPage: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    console.log("AdminDashboardPage mounted, admin check:", isAdmin());
    return () => console.log("AdminDashboardPage unmounted");
  }, [isAdmin]);

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

  // Fetch dashboard stats with fallback to mock data and better error handling
  const { data: stats, isLoading, error } = useQuery({
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
        console.log("Returning mock stats due to API error");
        return mockStats;
      }
    },
    retry: 1,
    staleTime: 60000,
    initialData: mockStats // Use mock stats as initial data
  });

  console.log("AdminDashboardPage rendering with stats:", stats, "isLoading:", isLoading, "error:", error);

  // Add explicit error handling in the UI
  if (error) {
    console.error("React Query error:", error);
    return (
      <AuthCheck requireAdmin>
        <div className="flex items-center justify-center min-h-screen bg-app-black text-white">
          <div className="text-center max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
            <h1 className="text-xl font-bold mb-4 text-red-500">Error Loading Admin Dashboard</h1>
            <p className="mb-4">There was a problem loading the admin dashboard data.</p>
            <div className="bg-black p-3 rounded text-xs text-left overflow-auto max-h-40">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </div>
          </div>
        </div>
      </AuthCheck>
    );
  }

  // Admin dashboard with tabs
  return (
    <AuthCheck requireAdmin>
      <div className="bg-app-black min-h-screen">
        <h1 className="text-2xl font-bold p-4">Admin Dashboard</h1>
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-app-yellow" />
            <span className="ml-2">Loading dashboard data...</span>
          </div>
        ) : (
          <AdminTabbedInterface 
            stats={stats || mockStats} 
            statsLoading={isLoading}
          />
        )}
      </div>
    </AuthCheck>
  );
};

export default AdminDashboardPage;
