import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import LivePage from '@/pages/LivePage';
import WatchPage from '@/pages/WatchPage';
import CheckoutPage from '@/pages/CheckoutPage';
import CategoryPage from '@/pages/CategoryPage';
import SearchPage from '@/pages/SearchPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminPage from '@/pages/AdminPage';
import AdminDashboardPage from "./pages/AdminDashboardPage";

const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);
  const { checkAuth } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
      setLoading(false);
    };

    initializeAuth();
  }, [checkAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/live/:streamId" element={<LivePage />} />
                <Route path="/watch/:videoId" element={<WatchPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </Router>
          <Toaster richColors closeButton />
        </CartProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
