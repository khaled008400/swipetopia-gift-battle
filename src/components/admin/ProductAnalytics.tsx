import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import ProductService from '@/services/product.service';

const ProductAnalytics = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [timeRange, setTimeRange] = useState('week');
  
  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductService.getProducts()
  });
  
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  
  useEffect(() => {
    if (allProducts) {
      // Generate mock sales data based on time range
      generateMockData(timeRange);
    }
  }, [allProducts, timeRange]);
  
  const generateMockData = (range) => {
    // Mock sales data
    const days = range === 'week' ? 7 : range === 'month' ? 30 : 90;
    const salesMockData = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: Math.floor(Math.random() * 1000) + 500,
        revenue: Math.floor(Math.random() * 5000) + 2000,
      };
    });
    setSalesData(salesMockData);
    
    // Mock category data
    const categories = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports', 'Books'];
    const categoryMockData = categories.map(category => ({
      name: category,
      value: Math.floor(Math.random() * 100) + 20,
    }));
    setCategoryData(categoryMockData);
    
    // Mock inventory data
    const inventoryMockData = allProducts?.slice(0, 10).map(product => ({
      name: product.name,
      stock: product.inventory_count || Math.floor(Math.random() * 100),
    })) || [];
    setInventoryData(inventoryMockData);
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];
  
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const averageOrderValue = totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : 0;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Analytics</h2>
        <div className="flex space-x-2">
          <select 
            className="bg-background border rounded-md px-3 py-1"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 90 days</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">${totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+12.5%</span> from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">{totalSales.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+8.2%</span> from previous period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">${averageOrderValue}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingDown className="inline h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-500">-2.3%</span> from previous period
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sales">Sales & Revenue</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="stock" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductAnalytics;
