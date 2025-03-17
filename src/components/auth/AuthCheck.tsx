
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAdmin?: boolean;
  requireSeller?: boolean;
}

/**
 * Wrapper component to check if user is authenticated
 * Redirects to login page if not authenticated
 */
const AuthCheck = ({ 
  children, 
  fallback, 
  requireAdmin = false, 
  requireSeller = false 
}: AuthCheckProps) => {
  const { isAuthenticated, isLoading, isAdmin, hasRole, user } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Only perform the check when loading is complete
    if (!isLoading) {
      const userIsAdmin = isAdmin ? isAdmin() : false;
      const userIsSeller = hasRole ? hasRole('seller') : false;
      
      console.log("AuthCheck - Auth status:", { 
        isAuthenticated, 
        requireAdmin,
        requireSeller,
        isAdmin: userIsAdmin,
        isSeller: userIsSeller,
        user,
        path: window.location.pathname
      });
      
      // First check if user is authenticated
      if (!isAuthenticated) {
        // If not authenticated, redirect to login with a return path
        console.log("User is not authenticated, redirecting to login");
        const returnPath = window.location.pathname;
        navigate(`/login?from=${encodeURIComponent(returnPath)}`);
        setIsAuthorized(false);
        return;
      } 
      
      // If admin access is required, check if user is admin
      if (requireAdmin) {
        console.log("Checking admin status:", userIsAdmin);
        
        if (!userIsAdmin) {
          console.log("User is not an admin, redirecting to home");
          navigate('/');
          setIsAuthorized(false);
          return;
        } else {
          console.log("User is an admin, access granted");
          setIsAuthorized(true);
          return;
        }
      }
      
      // If seller access is required, check if user is a seller
      if (requireSeller) {
        console.log("Checking seller status:", userIsSeller);
        
        if (!userIsSeller) {
          console.log("User is not a seller, redirecting to home");
          navigate('/');
          setIsAuthorized(false);
          return;
        } else {
          console.log("User is a seller, access granted");
          setIsAuthorized(true);
          return;
        }
      }
      
      // Regular authenticated access
      setIsAuthorized(true);
    }
  }, [isAuthenticated, isLoading, navigate, requireAdmin, requireSeller, isAdmin, hasRole, user]);

  // Show loading state
  if (isLoading || isAuthorized === null) {
    return fallback || (
      <div className="flex justify-center items-center h-[50vh] bg-app-black text-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-app-yellow mx-auto mb-2" />
          <p className="text-sm text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // If authorization check is complete and user is authorized, render children
  return isAuthorized ? <>{children}</> : null;
};

export default AuthCheck;
