
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import './App.css';
import Layout from './components/Layout';
import { supabase } from './integrations/supabase/client';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
