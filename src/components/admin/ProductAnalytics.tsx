
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '@/components/ui/chart';
import { useQuery } from '@tanstack/react-query';
import AdminService from '@/services/admin.service';
import { Loader2, TrendingUp, ShoppingCart, Package, ChartPie } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

type TimePeriod = 'week' | 'month' | 'year';

interface ProductAnalyticsProps {
  productId?: string; // Optional - can show analytics for a specific product or all products
}

const COLORS = ['#8B5CF6', '#F97316', '#0EA5E9', '#F43F5E', '#10B981'];

const ProductAnalytics: React.FC<ProductAnalyticsProps> = ({ productId }) => {
  const [period, setPeriod] = useState<TimePeriod>('month');

  // Fetch product sales data
  const { data: salesData, isLoading: isSalesLoading } = useQuery({
    queryKey: ['productSales', period, productId],
    queryFn: () => AdminService.getProductSalesData(period, productId),
    // Simulating API response with example data while we wait for backend implementation
    placeholderData: {
      sales: Array.from({ length: 30 }, (_, i) => ({
        date: `${i + 1}`,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        units: Math.floor(Math.random() * 50) + 10
      })),
      topProducts: [
        { name: 'T-Shirt', value: 35 },
        { name: 'Hoodie', value: 25 },
        { name: 'Cap', value: 20 },
        { name: 'Jeans', value: 15 },
        { name: 'Sneakers', value: 5 }
      ],
      categoryBreakdown: [
        { name: 'Clothing', value: 45 },
        { name: 'Accessories', value: 25 },
        { name: 'Footwear', value: 20 },
        { name: 'Other', value: 10 }
      ],
      inventoryTrends: Array.from({ length: 12 }, (_, i) => ({
        month: `Month ${i + 1}`,
        in_stock: Math.floor(Math.random() * 500) + 200,
        low_stock: Math.floor(Math.random() * 100),
        out_of_stock: Math.floor(Math.random() * 50)
      }))
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Product Analytics</h2>
          {productId && <span className="text-muted-foreground">(Single Product View)</span>}
        </div>
        <Select value={period} onValueChange={(value: TimePeriod) => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isSalesLoading 
                ? <Loader2 className="h-4 w-4 animate-spin" /> 
                : formatCurrency(salesData?.sales.reduce((acc, item) => acc + item.revenue, 0) || 0)
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {period === 'week' ? '7 days' : period === 'month' ? '30 days' : '12 months'} total revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isSalesLoading 
                ? <Loader2 className="h-4 w-4 animate-spin" /> 
                : salesData?.sales.reduce((acc, item) => acc + item.units, 0) || 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {period === 'week' ? '7 days' : period === 'month' ? '30 days' : '12 months'} total units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isSalesLoading 
                ? <Loader2 className="h-4 w-4 animate-spin" /> 
                : formatCurrency(
                    salesData?.sales.reduce((acc, item) => acc + item.revenue, 0) / 
                    Math.max(1, salesData?.sales.length) || 0
                  )
              }
            </div>
            <p className="text-xs text-muted-foreground">Per order average value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Category Split</CardTitle>
            <ChartPie className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isSalesLoading 
                ? <Loader2 className="h-4 w-4 animate-spin" /> 
                : salesData?.categoryBreakdown.length
              }
            </div>
            <p className="text-xs text-muted-foreground">Active product categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {isSalesLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ChartContainer
                config={{
                  revenue: { label: "Revenue", color: "#8B5CF6" },
                  units: { label: "Units", color: "#F97316" }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData?.sales || []}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8B5CF6" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      yAxisId="left"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="units" 
                      stroke="#F97316" 
                      yAxisId="right" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Products Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {isSalesLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesData?.topProducts || []}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesData?.topProducts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} units`, 'Sales']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Inventory Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {isSalesLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData?.inventoryTrends || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="in_stock" name="In Stock" fill="#10B981" />
                  <Bar dataKey="low_stock" name="Low Stock" fill="#F97316" />
                  <Bar dataKey="out_of_stock" name="Out of Stock" fill="#F43F5E" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {isSalesLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesData?.categoryBreakdown || []}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesData?.categoryBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductAnalytics;
