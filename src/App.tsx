
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Layout from "@/components/Layout";
import BottomNavigation from "@/components/BottomNavigation";
import "./App.css";

// Lazy-loaded page components
const HomePage = lazy(() => import("@/pages/HomePage"));
const ExplorePage = lazy(() => import("@/pages/ExplorePage"));
const ShopPage = lazy(() => import("@/pages/ShopPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const VideoPage = lazy(() => import("@/pages/VideoPage"));
const VideosPage = lazy(() => import("@/pages/VideosPage"));
const BattlePage = lazy(() => import("@/pages/BattlePage"));
const LiveStreamPage = lazy(() => import("@/pages/LiveStreamPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const SignupPage = lazy(() => import("@/pages/SignupPage"));
const ActivityPage = lazy(() => import("@/pages/ActivityPage"));
const WalletPage = lazy(() => import("@/pages/WalletPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const SellerDashboardPage = lazy(() => import("@/pages/SellerDashboardPage"));
const SellerProfilePage = lazy(() => import("@/pages/SellerProfilePage"));
const StreamerProfilePage = lazy(() => import("@/pages/StreamerProfilePage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Suspense
            fallback={
              <div className="h-screen w-screen flex items-center justify-center bg-app-black">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-yellow"></div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/video/:id" element={<VideoPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/battle" element={<BattlePage />} />
                <Route path="/live" element={<LiveStreamPage />} />
                <Route path="/activity" element={<ActivityPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
                <Route path="/seller/:id" element={<SellerProfilePage />} />
                <Route path="/streamer/:id" element={<StreamerProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </Suspense>
          <BottomNavigation />
          <Toaster />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
