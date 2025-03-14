
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShoppingBag, ChevronRight, BarChart3, Calendar, Link2 } from "lucide-react";
import ProductListings from "@/components/seller/ProductListings";
import SalesAnalytics from "@/components/seller/SalesAnalytics";
import StreamSchedule from "@/components/seller/StreamSchedule";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SellerDashboardPage = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  
  // Redirect if user is not a seller
  if (!user || !hasRole("seller")) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-app-black p-4">
        <ShoppingBag className="w-16 h-16 text-app-yellow mb-4" />
        <h1 className="text-xl font-bold mb-2">Seller Dashboard Access Denied</h1>
        <p className="text-gray-400 mb-4 text-center">
          You need to be a registered seller to access this dashboard.
        </p>
        <Button onClick={() => navigate("/")} className="bg-app-yellow text-app-black">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-app-black p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Seller Dashboard</h1>
        <div className="text-sm text-gray-400">
          {user?.shop_name || "My Shop"}
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-app-gray-dark mb-4">
          <TabsTrigger value="products" className="flex-1">
            <ShoppingBag className="w-4 h-4 mr-2" /> Products
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex-1">
            <BarChart3 className="w-4 h-4 mr-2" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="streams" className="flex-1">
            <Calendar className="w-4 h-4 mr-2" /> Streams
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <ProductListings />
        </TabsContent>
        
        <TabsContent value="analytics">
          <SalesAnalytics />
        </TabsContent>
        
        <TabsContent value="streams">
          <StreamSchedule />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerDashboardPage;
