
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface AuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Wrapper component to check if user is authenticated
 * Redirects to login page if not authenticated
 */
const AuthCheck = ({ children, fallback, requireAdmin = false }: AuthCheckProps) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoading) {
      // First check if user is authenticated
      if (!isAuthenticated) {
        // If not authenticated, redirect to login with a return path
        console.log("User is not authenticated, redirecting to login");
        const returnPath = window.location.pathname;
        navigate(`/login?from=${returnPath}`);
        setIsAuthorized(false);
      } 
      // If admin access is required, check if user is admin
      else if (requireAdmin) {
        const userIsAdmin = isAdmin();
        console.log("Checking admin status:", userIsAdmin);
        
        if (!userIsAdmin) {
          console.log("User is not an admin, redirecting to home");
          navigate('/');
          setIsAuthorized(false);
        } else {
          console.log("User is an admin, access granted");
          setIsAuthorized(true);
        }
      } else {
        // Regular authenticated access
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, isLoading, navigate, requireAdmin, isAdmin]);

  // Show loading state
  if (isLoading) {
    return fallback || (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }

  // If authorization check is complete and user is authorized, render children
  return isAuthorized ? <>{children}</> : null;
};

export default AuthCheck;
