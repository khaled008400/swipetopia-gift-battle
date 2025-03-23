
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import ActivityPage from '@/pages/ActivityPage';
import ProfilePage from '@/pages/ProfilePage';
import VideoPlayerPage from '@/pages/VideoPlayerPage';
import SearchPage from '@/pages/SearchPage';
import BattlePage from '@/pages/BattlePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import SettingsPage from '@/pages/SettingsPage';
import ShopPage from '@/pages/ShopPage';
import CategoryPage from '@/pages/CategoryPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import WalletPage from '@/pages/WalletPage';
import LivePage from '@/pages/LivePage';
import LiveStreamPage from '@/pages/LiveStreamPage';
import StreamerBroadcastPage from '@/pages/StreamerBroadcastPage';
import StreamerProfilePage from '@/pages/StreamerProfilePage';
import SellerProfilePage from '@/pages/SellerProfilePage';
import SellerDashboardPage from '@/pages/SellerDashboardPage';
import AdminPage from '@/pages/AdminPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/:id" element={<ProfilePage />} />
            <Route path="watch/:id" element={<VideoPlayerPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="battle/:id" element={<BattlePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="shop/:category" element={<CategoryPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="live" element={<LivePage />} />
            <Route path="live/:id" element={<LiveStreamPage />} />
            <Route path="broadcast" element={<StreamerBroadcastPage />} />
            <Route path="streamer/:id" element={<StreamerProfilePage />} />
            <Route path="seller/:id" element={<SellerProfilePage />} />
            <Route path="seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
