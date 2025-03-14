
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import BottomNavigation from "./BottomNavigation";
import { useEffect, useState } from "react";
import CreateContentMenu from "./CreateContentMenu";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  useEffect(() => {
    const handleToggleCreateMenu = () => {
      setShowCreateMenu(prev => !prev);
    };

    window.addEventListener('toggle-create-menu', handleToggleCreateMenu);
    
    return () => {
      window.removeEventListener('toggle-create-menu', handleToggleCreateMenu);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-app-black">
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>
      
      <BottomNavigation />
      
      {/* Create content menu */}
      <CreateContentMenu 
        isOpen={showCreateMenu} 
        onClose={() => setShowCreateMenu(false)} 
      />
    </div>
  );
};

export default Layout;
