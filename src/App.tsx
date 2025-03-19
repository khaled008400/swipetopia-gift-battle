
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import ProfilePage from '@/pages/ProfilePage';
import ActivityPage from '@/pages/ActivityPage';
import LivePage from '@/pages/LivePage';
import SettingsPage from '@/pages/SettingsPage';
import BattlePage from '@/pages/BattlePage';
import LiveStreamPage from '@/pages/LiveStreamPage';
import StreamerBroadcastPage from '@/pages/StreamerBroadcastPage';
import StreamerProfilePage from '@/pages/StreamerProfilePage';
import WatchPage from '@/pages/WatchPage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import SellerDashboardPage from '@/pages/SellerDashboardPage';
import SellerProfilePage from '@/pages/SellerProfilePage';
import AdminPage from '@/pages/AdminPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import SearchPage from '@/pages/SearchPage';
import NotFoundPage from '@/pages/NotFoundPage';
import WalletPage from '@/pages/WalletPage';
import VideoPlayerPage from '@/pages/VideoPlayerPage';
import VideosPage from '@/pages/VideosPage';  // Add import for VideosPage
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="live" element={<LivePage />} />
          <Route path="battles/:id" element={<BattlePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="streamer/:id" element={<StreamerProfilePage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="livestream/:id" element={<LiveStreamPage />} />
          <Route path="broadcast" element={<StreamerBroadcastPage />} />
          <Route path="watch/:id" element={<WatchPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="seller-dashboard" element={<SellerDashboardPage />} />
          <Route path="seller/:id" element={<SellerProfilePage />} />
          <Route path="admin/*" element={<AdminPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="video-player/:id" element={<VideoPlayerPage />} />
          <Route path="videos" element={<VideosPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
