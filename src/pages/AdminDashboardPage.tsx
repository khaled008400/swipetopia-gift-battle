
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminUsers from '@/components/admin/AdminUsers';
import AdminContent from '@/components/admin/AdminContent';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminVideos from '@/components/admin/AdminVideos';
import { LayoutDashboard, Users, Video, Tag, Gift, Settings } from 'lucide-react';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminVirtualGifts from '@/components/admin/AdminVirtualGifts';
import AdminSettings from '@/components/admin/AdminSettings';
import { useAuth } from '@/context/AuthContext';
import AuthCheck from '@/components/auth/AuthCheck';
import { AdminStats } from '@/services/admin.service';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1250,
    newUsersToday: 42,
    totalVideos: 3800,
    videoUploadsToday: 158,
    totalOrders: 762,
    ordersToday: 24,
    revenueTotal: 25680,
    revenueToday: 1250
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to be logged in to access this page.</p>
            <button
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use seller check as we no longer have admin role
  return (
    <AuthCheck requireSeller>
      <div className="flex flex-col min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-between pb-6 mb-8 border-b sm:flex-row border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>
          <div className="p-2 mt-4 text-sm text-gray-500 bg-gray-100 rounded-md sm:mt-0 dark:bg-gray-800 dark:text-gray-400">
            User: {user?.username}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
          <TabsList className="grid w-full grid-cols-6 h-14">
            <TabsTrigger value="dashboard" className="flex flex-col items-center justify-center gap-1">
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex flex-col items-center justify-center gap-1">
              <Users className="w-4 h-4" />
              <span className="text-xs">Users</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex flex-col items-center justify-center gap-1">
              <Video className="w-4 h-4" />
              <span className="text-xs">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex flex-col items-center justify-center gap-1">
              <Tag className="w-4 h-4" />
              <span className="text-xs">Products</span>
            </TabsTrigger>
            <TabsTrigger value="gifts" className="flex flex-col items-center justify-center gap-1">
              <Gift className="w-4 h-4" />
              <span className="text-xs">Gifts</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col items-center justify-center gap-1">
              <Settings className="w-4 h-4" />
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>

          <div className="p-4 mt-4 bg-white rounded-md shadow-sm dark:bg-gray-800">
            <TabsContent value="dashboard" className="m-0">
              <AdminDashboard stats={stats} />
            </TabsContent>
            <TabsContent value="users" className="m-0">
              <AdminUsers />
            </TabsContent>
            <TabsContent value="videos" className="m-0">
              <AdminVideos />
            </TabsContent>
            <TabsContent value="products" className="m-0">
              <AdminProducts />
            </TabsContent>
            <TabsContent value="gifts" className="m-0">
              <AdminVirtualGifts />
            </TabsContent>
            <TabsContent value="settings" className="m-0">
              <AdminSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </AuthCheck>
  );
};

export default AdminDashboardPage;
