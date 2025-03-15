
import { useEffect } from 'react';
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

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (requireAdmin && !isAdmin()) {
        // Redirect non-admin users to home page
        navigate('/');
      }
    }
  }, [isAuthenticated, isLoading, navigate, requireAdmin, isAdmin]);

  if (isLoading) {
    return fallback || (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-app-yellow" />
      </div>
    );
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin())) {
    return null;
  }

  return <>{children}</>;
};

export default AuthCheck;
