
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserRound, Film, Gift, AlertTriangle, 
  BadgeCheck, DollarSign, ShieldAlert,
  Database, Settings, ShoppingBag, FileText
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminVideos from './AdminVideos';
import AdminVirtualGifts from './AdminVirtualGifts';
import AdminReports from './AdminReports';
import AdminUserVerification from './AdminUserVerification';
import AdminRevenueStats from './AdminRevenueStats';
import AdminOrders from './AdminOrders';
import AdminCampaigns from './AdminCampaigns';
import AdminContent from './AdminContent';
import AdminSettings from './AdminSettings';
import { AdminStats } from '@/services/admin.service';

interface AdminTabbedInterfaceProps {
  stats: AdminStats;
  statsLoading?: boolean;
}

const AdminTabbedInterface: React.FC<AdminTabbedInterfaceProps> = ({ 
  stats, 
  statsLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-50">
            <ShieldAlert className="mr-2 h-4 w-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-50">
            <UserRound className="mr-2 h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-purple-50">
            <Film className="mr-2 h-4 w-4" /> Content
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-green-50">
            <ShoppingBag className="mr-2 h-4 w-4" /> Orders
          </TabsTrigger>
          <TabsTrigger value="gifts" className="data-[state=active]:bg-pink-50">
            <Gift className="mr-2 h-4 w-4" /> Virtual Gifts
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-red-50">
            <AlertTriangle className="mr-2 h-4 w-4" /> Reports
          </TabsTrigger>
          <TabsTrigger value="verification" className="data-[state=active]:bg-green-50">
            <BadgeCheck className="mr-2 h-4 w-4" /> Verification
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-yellow-50">
            <DollarSign className="mr-2 h-4 w-4" /> Revenue
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-orange-50">
            <FileText className="mr-2 h-4 w-4" /> Campaigns
          </TabsTrigger>
          <TabsTrigger value="database" className="data-[state=active]:bg-indigo-50">
            <Database className="mr-2 h-4 w-4" /> Database
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gray-50">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <AdminDashboard stats={stats} />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <AdminUsers />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <AdminContent />
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <AdminOrders />
        </TabsContent>
        
        <TabsContent value="gifts" className="space-y-4">
          <AdminVirtualGifts />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <AdminReports />
        </TabsContent>
        
        <TabsContent value="verification" className="space-y-4">
          <AdminUserVerification />
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <AdminRevenueStats />
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4">
          <AdminCampaigns />
        </TabsContent>
        
        <TabsContent value="database" className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Database Management</h2>
            <p className="text-gray-500 mb-4">Manage database connections, backups, and maintenance.</p>
            
            {/* Database connection status */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span>Database connection active</span>
            </div>
            
            {/* Database stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-2xl font-bold">238,429</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Storage Used</p>
                <p className="text-2xl font-bold">1.2 GB</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Last Backup</p>
                <p className="text-2xl font-bold">Today</p>
              </div>
            </div>
            
            {/* Tables section */}
            <h3 className="text-lg font-semibold mb-3">Tables</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">users</td>
                    <td className="px-6 py-4 whitespace-nowrap">12,543</td>
                    <td className="px-6 py-4 whitespace-nowrap">2 minutes ago</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">videos</td>
                    <td className="px-6 py-4 whitespace-nowrap">45,280</td>
                    <td className="px-6 py-4 whitespace-nowrap">5 minutes ago</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">orders</td>
                    <td className="px-6 py-4 whitespace-nowrap">8,753</td>
                    <td className="px-6 py-4 whitespace-nowrap">12 minutes ago</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTabbedInterface;
