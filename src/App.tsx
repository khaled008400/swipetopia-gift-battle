
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import './App.css';
import Layout from './components/Layout';
import { supabase } from './integrations/supabase/client';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { CartProvider } from './context/CartContext';
import RegisterPage from './pages/RegisterPage';
import SellerDashboardPage from './pages/SellerDashboardPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </Layout>
          <Toaster position="top-right" />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
