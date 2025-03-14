
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { useAuth } from "@/context/AuthContext";

// Dummy data - would be replaced with real data from API
const revenueData = [
  { name: "Jan", revenue: 1200 },
  { name: "Feb", revenue: 1900 },
  { name: "Mar", revenue: 1500 },
  { name: "Apr", revenue: 2400 },
  { name: "May", revenue: 2700 },
  { name: "Jun", revenue: 1800 },
  { name: "Jul", revenue: 3000 },
];

const topProducts = [
  { name: "Gaming Keyboard", sales: 124, revenue: 7440 },
  { name: "Wireless Headphones", sales: 98, revenue: 5880 },
  { name: "Ergonomic Mouse", sales: 87, revenue: 3480 },
  { name: "Mechanical Keyboard", sales: 76, revenue: 7600 },
  { name: "Bluetooth Speaker", sales: 65, revenue: 3250 },
];

const salesByCategory = [
  { name: "Electronics", value: 45 },
  { name: "Clothing", value: 25 },
  { name: "Accessories", value: 15 },
  { name: "Home", value: 10 },
  { name: "Other", value: 5 },
];

const SalesAnalytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("7days");

  // Calculate total revenue
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate average order value (dummy calculation)
  const totalOrders = 219; // This would come from real data
  const averageOrderValue = totalRevenue / totalOrders;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-app-yellow">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-app-gray-dark">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="w-full bg-app-gray-dark mb-4">
          <TabsTrigger value="revenue" className="flex-1">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="products" className="flex-1">
            Top Products
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex-1">
            Categories
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <Card className="bg-app-gray-dark">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Revenue Over Time</CardTitle>
                <Tabs 
                  value={timeRange} 
                  onValueChange={setTimeRange}
                  className="w-auto"
                >
                  <TabsList className="bg-app-black">
                    <TabsTrigger value="7days">7 Days</TabsTrigger>
                    <TabsTrigger value="30days">30 Days</TabsTrigger>
                    <TabsTrigger value="90days">90 Days</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#FFD700" 
                      activeDot={{ r: 8 }} 
                      name="Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products">
          <Card className="bg-app-gray-dark">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topProducts}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                    <Legend />
                    <Bar dataKey="sales" fill="#FFD700" name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Top Products by Revenue</h4>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-400">
                      <th className="pb-2">Product</th>
                      <th className="pb-2">Units Sold</th>
                      <th className="pb-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, i) => (
                      <tr key={i} className="border-t border-gray-700">
                        <td className="py-2">{product.name}</td>
                        <td className="py-2">{product.sales}</td>
                        <td className="py-2">${product.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card className="bg-app-gray-dark">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesByCategory}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 30,
                      left: 100,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                    <Legend />
                    <Bar dataKey="value" fill="#FFD700" name="Percentage (%)" />
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

export default SalesAnalytics;
