
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ShopPage from "./pages/ShopPage";
import ActivityPage from "./pages/ActivityPage";
import LiveStreamPage from "./pages/LiveStreamPage";
import BattlePage from "./pages/BattlePage";
import AdminPage from "./pages/AdminPage";
import WalletPage from "./pages/WalletPage";
import VideoPage from "./pages/VideoPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import SellerProfilePage from "./pages/SellerProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="activity" element={<ActivityPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="video/:videoId" element={<VideoPage />} />
                <Route path="admin" element={<AdminPage />} />
                <Route path="live/:streamId" element={<LiveStreamPage />} />
                <Route path="battle/:battleId" element={<BattlePage />} />
                <Route path="seller/dashboard" element={<SellerDashboardPage />} />
                <Route path="seller/:sellerId" element={<SellerProfilePage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </Router>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
