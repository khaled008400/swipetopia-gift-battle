import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import AdminReportsService from '@/services/admin-reports.service';
import { Loader2 } from 'lucide-react';

const AdminReports = () => {
  const [period, setPeriod] = useState('monthly');
  
  const { data: userGrowthData, isLoading: isLoadingUserData } = useQuery({
    queryKey: ['userGrowth', period],
    queryFn: () => AdminReportsService.getUserGrowthData(period),
  });
  
  const { data: engagementData, isLoading: isLoadingEngagementData } = useQuery({
    queryKey: ['videoEngagement', period],
    queryFn: () => AdminReportsService.getVideoEngagementData(period),
  });
  
  const { data: revenueData, isLoading: isLoadingRevenueData } = useQuery({
    queryKey: ['revenue', period],
    queryFn: () => AdminReportsService.getRevenueData(period),
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Reports</h2>
      </div>
      
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="engagement">Video Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                Track the growth of users over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUserData ? (
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : userGrowthData ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={userGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="newUsers" stroke="#8884d8" name="New Users" />
                    <Line type="monotone" dataKey="totalUsers" stroke="#82ca9d" name="Total Users" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p>No user growth data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Engagement</CardTitle>
              <CardDescription>
                Analyze video engagement metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingEngagementData ? (
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : engagementData ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
                    <Line type="monotone" dataKey="likes" stroke="#82ca9d" name="Likes" />
                    <Line type="monotone" dataKey="comments" stroke="#ffc658" name="Comments" />
                    <Line type="monotone" dataKey="shares" stroke="#a45de2" name="Shares" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p>No video engagement data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>
                Track revenue and transaction data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRevenueData ? (
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : revenueData ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
                    <Line type="monotone" dataKey="transactions" stroke="#82ca9d" name="Transactions" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p>No revenue data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
