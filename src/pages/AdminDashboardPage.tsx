
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import AdminService, { AdminStats } from '@/services/admin.service';
import AdminTabbedInterface from '@/components/admin/AdminTabbedInterface';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Fetch dashboard stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: AdminService.getDashboardStats,
    enabled: !!user && isAdmin(), // Only fetch if user is logged in and has admin role
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Check if user is an admin using context method
      if (user && isAdmin()) {
        setIsAuthorized(true);
      } else {
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Redirect if not authorized
  if (isAuthorized === false) {
    return <Navigate to="/" replace />;
  }

  // Display error state if stats failed to load but user is authorized
  if (!isLoading && !stats && isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Error Loading Admin Dashboard</h2>
            <p>Failed to load admin statistics. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin dashboard with tabs
  return (
    <AdminTabbedInterface 
      stats={stats || {
        totalUsers: 0,
        newUsersToday: 0,
        totalVideos: 0,
        videoUploadsToday: 0,
        totalOrders: 0,
        ordersToday: 0,
        revenueTotal: 0,
        revenueToday: 0
      } as AdminStats} 
      statsLoading={isLoading}
    />
  );
};

export default AdminDashboardPage;
