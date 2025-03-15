
import React from 'react';
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
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Create a mock supabase client for now until we properly integrate it
const supabaseClient = createClient(
  'https://placeholder-url.supabase.co',
  'placeholder-key'
);

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Mock session setup for now
    setSession(null);
  }, []);

  return (
    <div className="App flex flex-col min-h-screen bg-app-black text-white">
      <AuthProvider supabaseClient={supabaseClient} session={session}>
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
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
