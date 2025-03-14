
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Gift, 
  Layout, 
  Package, 
  PercentCircle, 
  Radio, 
  ShoppingCart, 
  Ticket, 
  Truck, 
  Users, 
  Video,
  Loader2, 
  Menu 
} from 'lucide-react';
import { AdminStats } from '@/services/admin.service';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminVideos from './AdminVideos';
import AdminCoupons from './AdminCoupons';
import AdminOffers from './AdminOffers';
import AdminShipping from './AdminShipping';
import AdminReports from './AdminReports';
import AdminLiveStreams from './AdminLiveStreams';
import VirtualGifts from './VirtualGifts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Button } from '../ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';

interface AdminTabbedInterfaceProps {
  stats: AdminStats;
  statsLoading: boolean;
}

const AdminTabbedInterface: React.FC<AdminTabbedInterfaceProps> = ({ stats, statsLoading }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Log stats to verify data 
  console.log("Admin stats:", stats);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Layout size={16} /> },
    { id: "products", label: "Products", icon: <Package size={16} /> },
    { id: "users", label: "Users", icon: <Users size={16} /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={16} /> },
    { id: "videos", label: "Videos", icon: <Video size={16} /> },
    { id: "virtual-gifts", label: "Virtual Gifts", icon: <Gift size={16} /> },
    { id: "coupons", label: "Coupons", icon: <Ticket size={16} /> },
    { id: "offers", label: "Offers", icon: <PercentCircle size={16} /> },
    { id: "shipping", label: "Shipping", icon: <Truck size={16} /> },
    { id: "reports", label: "Reports", icon: <BarChart size={16} /> },
    { id: "live-streams", label: "Live Streams", icon: <Radio size={16} /> },
  ];

  // Mobile view
  const MobileTabsView = () => (
    <div className="md:hidden">
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="mb-4">
            <Menu className="h-4 w-4 mr-2" />
            {tabs.find(tab => tab.id === activeTab)?.label || "Menu"}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {tabs.map(tab => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsDrawerOpen(false);
                  }}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );

  // Desktop view
  const DesktopTabsView = () => (
    <div className="hidden md:block">
      <TabsList className="mb-4 flex flex-wrap space-x-1">
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id} className="flex items-center">
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <MobileTabsView />
        <DesktopTabsView />
        
        <TabsContent value="dashboard">
          <AdminDashboard stats={stats} />
        </TabsContent>
        
        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
        
        <TabsContent value="videos">
          <AdminVideos />
        </TabsContent>
        
        <TabsContent value="live-streams">
          <AdminLiveStreams />
        </TabsContent>
        
        <TabsContent value="orders">
          <AdminOrders />
        </TabsContent>
        
        <TabsContent value="products">
          <AdminProducts />
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
        
        <TabsContent value="virtual-gifts" className="p-0">
          <VirtualGifts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTabbedInterface;
