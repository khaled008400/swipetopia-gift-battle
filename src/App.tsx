
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import WalletPage from './pages/WalletPage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider } from './context/AuthContext';
import VideoPlayerPage from './pages/VideoPlayerPage';
import Layout from './components/Layout';
import { CartProvider } from './context/CartContext';
import ShopPage from './pages/ShopPage';
import ExplorePage from './pages/ExplorePage';
import SignupPage from './pages/SignupPage';
import AdminPage from './pages/AdminPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuthCheck from './components/auth/AuthCheck';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Log configuration for debugging
    console.log("App initialized with Supabase client");

    // Check for existing session on mount
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data?.session || null);
    };
    
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log("Auth state changed:", _event);
        setSession(newSession);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App flex flex-col min-h-screen bg-app-black text-white">
        <AuthProvider supabaseClient={supabase} session={session}>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/" element={<Layout><HomePage /></Layout>} />
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                <Route path="/wallet" element={<Layout><WalletPage /></Layout>} />
                <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
                <Route path="/video/:videoId" element={<Layout><VideoPlayerPage /></Layout>} />
                <Route path="/explore" element={<Layout><ExplorePage /></Layout>} />
                <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
                <Route path="/admin" element={
                  <AuthCheck requireAdmin={true}>
                    <Layout><AdminPage /></Layout>
                  </AuthCheck>
                } />
                <Route path="/admin-dashboard" element={
                  <AuthCheck requireAdmin={true}>
                    <Layout><AdminDashboardPage /></Layout>
                  </AuthCheck>
                } />
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </div>
    </QueryClientProvider>
  );
}

export default App;
