
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

  console.log("Layout rendering with:", { isAuthenticated, isLoading });

  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-app-black">
        <Loader2 className="h-12 w-12 animate-spin text-app-yellow" />
        <p className="mt-4 text-white">Loading app...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
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
