
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UsersTable, 
  ContentModeration, 
  VirtualGifts, 
  AdminLoginForm, 
  ReportedVideos,
  UserVerification,
  RevenueStats
} from '@/components/admin';
import { Card, CardContent } from '@/components/ui/card';
import { 
  UserRound, Film, Gift, AlertTriangle, 
  BadgeCheck, DollarSign, ShieldAlert 
} from 'lucide-react';

interface AdminPageProps {
  // No props needed
}

const AdminPage: React.FC<AdminPageProps> = () => {
  const { user, isAdmin } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  
  useEffect(() => {
    // Check if user is admin
    if (user && isAdmin()) {
      setIsAuthenticated(true);
    }
  }, [user, isAdmin]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // For demo purposes, we'll show the admin login form if not authenticated
  // In a real app, we would redirect non-admin users away
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <ShieldAlert className="h-12 w-12 mx-auto text-primary mb-2" />
          <h1 className="text-2xl font-bold">Admin Authentication</h1>
          <p className="text-gray-500">Please log in with your admin credentials</p>
        </div>
        <AdminLoginForm />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">12,534</p>
              </div>
              <UserRound className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Content Items</p>
                <p className="text-2xl font-bold">45,291</p>
              </div>
              <Film className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Revenue (USD)</p>
                <p className="text-2xl font-bold">$392,150</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-50">
            <UserRound className="mr-2 h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="content" className="data-[state=active]:bg-purple-50">
            <Film className="mr-2 h-4 w-4" /> Content
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
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <UsersTable />
        </TabsContent>
        
        <TabsContent value="content" className="space-y-4">
          <ContentModeration />
        </TabsContent>
        
        <TabsContent value="gifts" className="space-y-4">
          <VirtualGifts />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <ReportedVideos />
        </TabsContent>
        
        <TabsContent value="verification" className="space-y-4">
          <UserVerification />
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <RevenueStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
