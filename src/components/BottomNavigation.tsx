
import { Link, useLocation } from "react-router-dom";
import { Home, Plus, ShoppingBag, User, Video, Zap } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-full mx-4 mb-4 h-14 flex items-center justify-between px-8 z-40 shadow-lg">
      <Link to="/" className={`group nav-item ${isActive('/') ? 'text-app-yellow bg-app-black rounded-full p-2' : 'text-gray-400'}`}>
        <Home className={`nav-icon h-5 w-5 ${isActive('/') ? 'text-app-yellow' : ''}`} />
      </Link>
      <Link to="/videos" className={`group nav-item ${isActive('/videos') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <Video className={`nav-icon h-5 w-5 ${isActive('/videos') ? 'text-app-yellow' : ''}`} />
      </Link>
      <button 
        className="bg-app-yellow text-app-black rounded-full p-3 -mt-5 shadow-lg"
        onClick={() => window.dispatchEvent(new CustomEvent('toggle-create-menu'))}
      >
        <Plus className="h-6 w-6" />
      </button>
      <Link to="/live" className={`group nav-item ${isActive('/live') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <Zap className={`nav-icon h-5 w-5 ${isActive('/live') ? 'text-app-yellow' : ''}`} />
      </Link>
      <Link to="/shop" className={`group nav-item ${isActive('/shop') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <ShoppingBag className={`nav-icon h-5 w-5 ${isActive('/shop') ? 'text-app-yellow' : ''}`} />
      </Link>
      <Link to="/profile" className={`group nav-item ${isActive('/profile') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <User className={`nav-icon h-5 w-5 ${isActive('/profile') ? 'text-app-yellow' : ''}`} />
      </Link>
    </div>
  );
};

export default BottomNavigation;
