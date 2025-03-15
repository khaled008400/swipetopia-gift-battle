
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import BottomNavigation from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import CreateContentMenu from './CreateContentMenu';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  useEffect(() => {
    // Listen for the custom event from the plus button
    const handleToggleCreateMenu = () => {
      setIsCreateMenuOpen(prevState => !prevState);
    };

    window.addEventListener('toggle-create-menu', handleToggleCreateMenu);

    return () => {
      window.removeEventListener('toggle-create-menu', handleToggleCreateMenu);
    };
  }, []);

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

      {/* Create Content Menu */}
      <CreateContentMenu 
        isOpen={isCreateMenuOpen} 
        onClose={() => setIsCreateMenuOpen(false)} 
      />
    </div>
  );
};

export default Layout;
