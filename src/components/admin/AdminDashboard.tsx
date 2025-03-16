
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStats } from '@/services/admin.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpCircle, ShoppingBag, User, Video } from 'lucide-react';

interface AdminDashboardProps {
  stats: AdminStats;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats }) => {
  console.log("AdminDashboard received stats:", stats);
  
  // Ensure stats is properly defined, otherwise show default values
  const safeStats: AdminStats = stats || {
    totalUsers: 0,
    newUsersToday: 0,
    totalVideos: 0,
    videoUploadsToday: 0,
    totalOrders: 0,
    ordersToday: 0,
    revenueTotal: 0,
    revenueToday: 0
  };
  
  const revenueData = [
    { name: 'Mon', revenue: 2400 },
    { name: 'Tue', revenue: 1398 },
    { name: 'Wed', revenue: 9800 },
    { name: 'Thu', revenue: 3908 },
    { name: 'Fri', revenue: 4800 },
    { name: 'Sat', revenue: 3800 },
    { name: 'Sun', revenue: 4300 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpCircle className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">{safeStats.newUsersToday}</span> new today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.totalVideos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpCircle className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">{safeStats.videoUploadsToday}</span> new today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeStats.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpCircle className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">{safeStats.ordersToday}</span> new today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${safeStats.revenueTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpCircle className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500">${safeStats.revenueToday}</span> today
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
            <CardDescription>Revenue for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm">New user registered <span className="font-medium">@janesmith</span></p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm">New video uploaded by <span className="font-medium">@dancequeen</span></p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm">New order <span className="font-medium">#1234</span> has been placed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm">Video flagged for review <span className="font-medium">ID: 5678</span></p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm">New product added to shop <span className="font-medium">Trendy Hoodie</span></p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
