
import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, User, ShoppingBag, Wallet } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-app-gray-dark border-t border-app-gray-light h-16 flex items-center justify-around z-50 animate-slide-up">
      <Link to="/" className={`group nav-item ${isActive('/') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <Home className={`nav-icon ${isActive('/') ? 'text-app-yellow' : ''}`} />
        <span className="mt-1">Home</span>
      </Link>
      <Link to="/battles" className={`group nav-item ${isActive('/battles') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <Trophy className={`nav-icon ${isActive('/battles') ? 'text-app-yellow' : ''}`} />
        <span className="mt-1">Battles</span>
      </Link>
      <Link to="/shop" className={`group nav-item ${isActive('/shop') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <ShoppingBag className={`nav-icon ${isActive('/shop') ? 'text-app-yellow' : ''}`} />
        <span className="mt-1">Shop</span>
      </Link>
      <Link to="/wallet" className={`group nav-item ${isActive('/wallet') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <Wallet className={`nav-icon ${isActive('/wallet') ? 'text-app-yellow' : ''}`} />
        <span className="mt-1">Wallet</span>
      </Link>
      <Link to="/profile" className={`group nav-item ${isActive('/profile') ? 'text-app-yellow' : 'text-gray-400'}`}>
        <User className={`nav-icon ${isActive('/profile') ? 'text-app-yellow' : ''}`} />
        <span className="mt-1">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
