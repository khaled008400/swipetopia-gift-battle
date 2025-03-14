
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import VideoPage from "./pages/VideoPage";
import WalletPage from "./pages/WalletPage";
import ShopPage from "./pages/ShopPage";
import NotFound from "./pages/NotFound";
import LiveStreamPage from "./pages/LiveStreamPage";
import ActivityPage from "./pages/ActivityPage";
import ExplorePage from "./pages/ExplorePage";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("App component rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="videos" element={<VideoPage />} />
                <Route path="live" element={<LiveStreamPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="activity" element={<ActivityPage />} />
                <Route path="explore" element={<ExplorePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
};

export default App;
