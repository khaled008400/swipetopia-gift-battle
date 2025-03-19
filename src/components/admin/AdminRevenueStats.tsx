
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Gift, ShoppingBag } from 'lucide-react';
import { RevenueStats } from '@/components/admin';

const revenueData = [
  { month: 'Jan', revenue: 35000, subscriptions: 12000, coins: 15000, gifts: 8000 },
  { month: 'Feb', revenue: 47000, subscriptions: 14000, coins: 19000, gifts: 14000 },
  { month: 'Mar', revenue: 39000, subscriptions: 13000, coins: 16000, gifts: 10000 },
  { month: 'Apr', revenue: 52000, subscriptions: 16000, coins: 22000, gifts: 14000 },
  { month: 'May', revenue: 68000, subscriptions: 19000, coins: 29000, gifts: 20000 },
  { month: 'Jun', revenue: 72000, subscriptions: 21000, coins: 31000, gifts: 20000 },
  { month: 'Jul', revenue: 83000, subscriptions: 24000, coins: 35000, gifts: 24000 },
  { month: 'Aug', revenue: 91000, subscriptions: 26000, coins: 39000, gifts: 26000 },
  { month: 'Sep', revenue: 86000, subscriptions: 25000, coins: 37000, gifts: 24000 },
  { month: 'Oct', revenue: 94000, subscriptions: 28000, coins: 40000, gifts: 26000 },
  { month: 'Nov', revenue: 103000, subscriptions: 30000, coins: 43000, gifts: 30000 },
  { month: 'Dec', revenue: 112000, subscriptions: 33000, coins: 47000, gifts: 32000 },
];

const dailyData = [
  { day: 'Mon', revenue: 5200 },
  { day: 'Tue', revenue: 4800 },
  { day: 'Wed', revenue: 6100 },
  { day: 'Thu', revenue: 5700 },
  { day: 'Fri', revenue: 7200 },
  { day: 'Sat', revenue: 8900 },
  { day: 'Sun', revenue: 7600 },
];

const sourceData = [
  { name: 'Subscriptions', value: 35 },
  { name: 'Coin Purchases', value: 40 },
  { name: 'Virtual Gifts', value: 20 },
  { name: 'Merchandise', value: 5 },
];

const AdminRevenueStats: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">$982,150</p>
                <p className="text-sm text-green-600">+12.5% from last year</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Subscription Revenue</p>
                <p className="text-2xl font-bold">$343,750</p>
                <p className="text-sm text-green-600">+8.3% from last year</p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Coin Purchases</p>
                <p className="text-2xl font-bold">$392,860</p>
                <p className="text-sm text-green-600">+15.2% from last year</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Gift Revenue</p>
                <p className="text-2xl font-bold">$196,430</p>
                <p className="text-sm text-green-600">+18.7% from last year</p>
              </div>
              <Gift className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="yearly">
            <TabsList className="mb-4">
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="yearly">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Total Revenue" />
                    <Line type="monotone" dataKey="subscriptions" stroke="#8b5cf6" name="Subscriptions" />
                    <Line type="monotone" dataKey="coins" stroke="#3b82f6" name="Coin Purchases" />
                    <Line type="monotone" dataKey="gifts" stroke="#ec4899" name="Virtual Gifts" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="weekly">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" name="Daily Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <RevenueStats />
    </div>
  );
};

export default AdminRevenueStats;
