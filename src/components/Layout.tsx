
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import BottomNavigation from './BottomNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import CreateContentMenu from './CreateContentMenu';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
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
    <div className="flex flex-col min-h-screen relative bg-app-black">
      <main className="flex-grow pb-20">
        {children}
      </main>
      
      {isMobile && <BottomNavigation />}
      
      <footer className="py-4 px-4 border-t border-app-gray-dark">
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
