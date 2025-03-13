
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BottomNavigation from "./BottomNavigation";
import { Plus, VideoIcon } from "lucide-react";
import { useState } from "react";
import CreateContentMenu from "./CreateContentMenu";

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-app-black">
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
      
      {/* Floating Action Button */}
      <div className="fixed z-50 bottom-20 right-4">
        <button 
          className="bg-app-yellow text-app-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          onClick={() => setShowCreateMenu(true)}
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
      
      <CreateContentMenu 
        isOpen={showCreateMenu} 
        onClose={() => setShowCreateMenu(false)} 
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Layout;
