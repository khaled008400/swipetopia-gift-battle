
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BottomNavigation from "./BottomNavigation";
import { useEffect, useState } from "react";
import CreateContentMenu from "./CreateContentMenu";
import { Loader2 } from "lucide-react";

const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleToggleCreateMenu = () => {
      setShowCreateMenu(prev => !prev);
    };

    window.addEventListener('toggle-create-menu', handleToggleCreateMenu);
    
    return () => {
      window.removeEventListener('toggle-create-menu', handleToggleCreateMenu);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-app-black">
        <Loader2 className="h-12 w-12 animate-spin text-app-yellow" />
        <p className="mt-4 text-white">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
