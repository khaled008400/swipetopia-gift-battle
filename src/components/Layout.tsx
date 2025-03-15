
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import BottomNavigation from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen relative">
      <main className="flex-grow pb-20">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      
      {isMobile && <BottomNavigation />}
      
      <footer className="py-4 px-4 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Luv. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
