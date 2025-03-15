import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, User, Menu, X, Shield } from 'lucide-react';
import SearchBar from './SearchBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <header className="py-2 px-4 border-b sticky top-0 bg-white z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-app-black">
            Luv<span className="text-app-yellow">.</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <SearchBar />
            
            <Link to="/shop" className="text-sm font-medium text-app-black hover:text-app-yellow">
              Shop
            </Link>
            
            <Link to="/live" className="text-sm font-medium text-app-black hover:text-app-yellow">
              Live
            </Link>
            
            {user && isAdmin() && (
              <Link to="/admin" className="flex items-center text-sm font-medium text-app-black hover:text-app-yellow">
                <Shield className="h-5 w-5 mr-1" />
                Admin
              </Link>
            )}
            
            <Link to="/cart" className="relative text-sm font-medium text-app-black hover:text-app-yellow">
              <ShoppingBag className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-app-yellow text-white text-xs rounded-full px-1.5 py-0 h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <Link to="/profile" className="text-sm font-medium text-app-black hover:text-app-yellow">
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium text-app-black hover:text-app-yellow">
                Login
              </Link>
            )}
            
            <button onClick={toggleMenu} className="md:hidden text-app-black focus:outline-none">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
      
      <footer className="py-4 px-4 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Luv. All rights reserved.
        </div>
      </footer>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-20 md:hidden">
          <div className="p-4 flex justify-end">
            <button onClick={closeMenu} className="text-app-black focus:outline-none">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col items-center gap-6 mt-12">
            <Link to="/shop" className="text-xl font-medium text-app-black hover:text-app-yellow" onClick={closeMenu}>
              Shop
            </Link>
            <Link to="/live" className="text-xl font-medium text-app-black hover:text-app-yellow" onClick={closeMenu}>
              Live
            </Link>
            {user ? (
              <Link to="/profile" className="text-xl font-medium text-app-black hover:text-app-yellow" onClick={closeMenu}>
                Profile
              </Link>
            ) : (
              <Link to="/login" className="text-xl font-medium text-app-black hover:text-app-yellow" onClick={closeMenu}>
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Layout;
