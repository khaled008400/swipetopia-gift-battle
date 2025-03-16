
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingBag, ChevronRight, BarChart3, 
  Calendar, MessageSquare, RefreshCcw, 
  Star, Wallet, Settings, Store, ShieldAlert
} from "lucide-react";
import ProductListings from "@/components/seller/ProductListings";
import SalesAnalytics from "@/components/seller/SalesAnalytics";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SellerMessages from "@/components/seller/SellerMessages";
import RefundManager from "@/components/seller/RefundManager";
import ProductReviews from "@/components/seller/ProductReviews";
import SellerWalletView from "@/components/seller/SellerWalletView";
import ShopProfileEditor from "@/components/seller/ShopProfileEditor";
import AuthCheck from "@/components/auth/AuthCheck";

const SellerDashboardPage = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  
  return (
    <AuthCheck>
      <div className="flex flex-col min-h-[calc(100vh-64px)] bg-app-black p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Seller Dashboard</h1>
          <div className="text-sm text-gray-400">
            {user?.shop_name || "My Shop"}
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-app-gray-dark mb-4 flex flex-wrap">
            <TabsTrigger value="products" className="flex-1">
              <ShoppingBag className="w-4 h-4 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1">
              <BarChart3 className="w-4 h-4 mr-2" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" /> Messages
            </TabsTrigger>
            <TabsTrigger value="refunds" className="flex-1">
              <RefreshCcw className="w-4 h-4 mr-2" /> Refunds
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              <Star className="w-4 h-4 mr-2" /> Reviews
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex-1">
              <Wallet className="w-4 h-4 mr-2" /> Wallet
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1">
              <Store className="w-4 h-4 mr-2" /> Shop Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductListings />
          </TabsContent>
          
          <TabsContent value="analytics">
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value="messages">
            <SellerMessages />
          </TabsContent>

          <TabsContent value="refunds">
            <RefundManager />
          </TabsContent>

          <TabsContent value="reviews">
            <ProductReviews />
          </TabsContent>

          <TabsContent value="wallet">
            <SellerWalletView />
          </TabsContent>

          <TabsContent value="profile">
            <ShopProfileEditor />
          </TabsContent>
        </Tabs>
      </div>
    </AuthCheck>
  );
};

export default SellerDashboardPage;
