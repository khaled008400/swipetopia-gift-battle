
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Video, Heart, User, Plus } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;

  const handleCreateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Dispatch custom event for Layout to listen to
    window.dispatchEvent(new Event('toggle-create-menu'));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-app-black border-t border-app-gray-dark p-2 flex justify-around items-center z-50">
      <Link 
        to="/" 
        className={`flex flex-col items-center p-2 ${path === '/' ? 'text-app-yellow' : 'text-gray-400'}`}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link 
        to="/explore" 
        className={`flex flex-col items-center p-2 ${path.includes('/explore') ? 'text-app-yellow' : 'text-gray-400'}`}
      >
        <Search className="h-6 w-6" />
        <span className="text-xs mt-1">Discover</span>
      </Link>
      
      <button
        onClick={handleCreateClick}
        className="rounded-full bg-app-yellow text-black w-12 h-12 flex items-center justify-center -mt-5 border-4 border-app-black"
      >
        <Plus className="h-6 w-6" />
      </button>
      
      <Link 
        to="/activity" 
        className={`flex flex-col items-center p-2 ${path.includes('/activity') ? 'text-app-yellow' : 'text-gray-400'}`}
      >
        <Heart className="h-6 w-6" />
        <span className="text-xs mt-1">Activity</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={`flex flex-col items-center p-2 ${path.includes('/profile') ? 'text-app-yellow' : 'text-gray-400'}`}
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
