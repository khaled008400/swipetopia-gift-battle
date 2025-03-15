
import { Link, useLocation } from "react-router-dom";
import { Home, Plus, ShoppingBag, User, Settings, Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

const BottomNavigation = () => {
  const location = useLocation();
  const cartContext = useCart();
  // Use a default value if cart context is not available
  const itemCount = cartContext?.itemCount || 0;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-app-black border-t border-app-gray-dark rounded-t-xl mx-0 h-16 flex items-center justify-between px-6 z-40 shadow-lg">
      <Link to="/" className={`group nav-item ${isActive('/') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <Home className={`nav-icon h-5 w-5 ${isActive('/') ? 'text-app-yellow' : ''}`} />
      </Link>
      <Link to="/explore" className={`group nav-item ${isActive('/explore') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <Search className={`nav-icon h-5 w-5 ${isActive('/explore') ? 'text-app-yellow' : ''}`} />
      </Link>
      <Link to="/shop" className={`group nav-item ${isActive('/shop') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <ShoppingCart className={`nav-icon h-5 w-5 ${isActive('/shop') ? 'text-app-yellow' : ''}`} />
      </Link>
      <button 
        className="bg-app-yellow text-app-black rounded-full p-3 -mt-5 shadow-lg"
        onClick={() => window.dispatchEvent(new CustomEvent('toggle-create-menu'))}
      >
        <Plus className="h-6 w-6" />
      </button>
      <Link to="/wallet" className={`group nav-item ${isActive('/wallet') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <ShoppingBag className={`nav-icon h-5 w-5 ${isActive('/wallet') ? 'text-app-yellow' : ''}`} />
        {itemCount > 0 && !isActive('/wallet') && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-app-yellow text-app-black text-[10px]">
            {itemCount > 9 ? '9+' : itemCount}
          </Badge>
        )}
      </Link>
      <Link to="/profile" className={`group nav-item ${isActive('/profile') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <User className={`nav-icon h-5 w-5 ${isActive('/profile') ? 'text-app-yellow' : ''}`} />
      </Link>
      <Link to="/settings" className={`group nav-item ${isActive('/settings') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <Settings className={`nav-icon h-5 w-5 ${isActive('/settings') ? 'text-app-yellow' : ''}`} />
      </Link>
    </div>
  );
};

export default BottomNavigation;
