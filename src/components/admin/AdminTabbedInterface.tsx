
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminVideos from '@/components/admin/AdminVideos';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminReports from '@/components/admin/AdminReports';
import ProductAttributes from '@/components/admin/ProductAttributes';
import AdminCoupons from '@/components/admin/AdminCoupons';
import AdminOffers from '@/components/admin/AdminOffers';
import AdminShipping from '@/components/admin/AdminShipping';
import { AdminStats } from '@/services/admin.service';
import { Loader2 } from 'lucide-react';

interface AdminTabbedInterfaceProps {
  stats: AdminStats;
  statsLoading: boolean;
}

const AdminTabbedInterface: React.FC<AdminTabbedInterfaceProps> = ({ stats, statsLoading }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Log stats to verify data 
  console.log("Admin stats:", stats);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage your app's content and users</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-10 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <AdminDashboard stats={stats} />
        </TabsContent>
        
        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
        
        <TabsContent value="videos">
          <AdminVideos />
        </TabsContent>
        
        <TabsContent value="orders">
          <AdminOrders />
        </TabsContent>
        
        <TabsContent value="products">
          <AdminProducts />
        </TabsContent>
        
        <TabsContent value="attributes">
          <ProductAttributes />
        </TabsContent>
        
        <TabsContent value="coupons">
          <AdminCoupons />
        </TabsContent>
        
        <TabsContent value="offers">
          <AdminOffers />
        </TabsContent>
        
        <TabsContent value="shipping">
          <AdminShipping />
        </TabsContent>
        
        <TabsContent value="reports">
          <AdminReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTabbedInterface;
