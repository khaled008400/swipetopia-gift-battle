import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { adminApi } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

// Define the query function without parameters
const getProductAnalyticsData = () => {
  // Mock data function - in a real app this would be an API call
  return Promise.resolve({
    salesTrend: [
      { month: 'Jan', sales: 4000, orders: 240 },
      { month: 'Feb', sales: 3000, orders: 198 },
      { month: 'Mar', sales: 5000, orders: 250 },
      { month: 'Apr', sales: 2780, orders: 190 },
      { month: 'May', sales: 1890, orders: 130 },
      { month: 'Jun', sales: 2390, orders: 140 },
      { month: 'Jul', sales: 3490, orders: 160 },
    ],
    categoryPerformance: [
      { category: 'Electronics', sales: 12000, views: 3400 },
      { category: 'Clothing', sales: 8000, views: 2200 },
      { category: 'Home', sales: 5000, views: 1800 },
      { category: 'Beauty', sales: 4000, views: 1400 },
      { category: 'Sports', sales: 3000, views: 1200 },
    ]
  });
};

const ProductAnalytics = () => {
  // Updated query with proper function call (no arguments)
  const { data, isLoading } = useQuery({
    queryKey: ['productAnalytics'],
    queryFn: getProductAnalyticsData
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return <div>No analytics data available</div>;
  }

  const salesTrendData = data.salesTrend;
  const categoryPerformanceData = data.categoryPerformance;

  return (
    <Tabs defaultValue="sales-trend" className="w-full">
      <TabsList>
        <TabsTrigger value="sales-trend">Sales Trend</TabsTrigger>
        <TabsTrigger value="category-performance">Category Performance</TabsTrigger>
      </TabsList>
      <TabsContent value="sales-trend" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Monthly sales and orders overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
                <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="category-performance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Sales and views by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                <Bar dataKey="views" fill="#82ca9d" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProductAnalytics;
