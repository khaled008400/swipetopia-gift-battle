
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

  // More detailed logging for debugging
  console.log("AdminDashboardPage - Rendering");
  console.log("AdminDashboardPage - User:", user);

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
    enabled: !!user, // Only fetch if user is logged in
    retry: false, // Don't retry on failure for now (for debugging)
    initialData: mockStats // Use mock stats as initial data
  });

  // Check if user is authorized as admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        console.log("No user detected - not authorized");
        setIsAuthorized(false);
        return;
      }
      
      try {
        const adminCheck = isAdmin ? isAdmin() : false;
        console.log("Admin check result:", adminCheck);
        
        if (adminCheck) {
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
      } catch (e) {
        console.error("Error checking admin status:", e);
        setIsAuthorized(false);
      }
    };

    checkAdminAccess();
  }, [user, isAdmin, toast]);

  // Add explicit error handling in the UI
  if (error) {
    console.error("React Query error:", error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-app-black text-white">
        <div className="text-center max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
          <h1 className="text-xl font-bold mb-4 text-red-500">Error Loading Admin Dashboard</h1>
          <p className="mb-4">There was a problem loading the admin dashboard data.</p>
          <div className="bg-black p-3 rounded text-xs text-left overflow-auto max-h-40">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </div>
        </div>
      </div>
    );
  }

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
    console.log("Not authorized, redirecting to home page");
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
