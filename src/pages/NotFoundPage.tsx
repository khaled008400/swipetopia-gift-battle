
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-6xl md:text-8xl font-bold text-app-yellow mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button variant="secondary" onClick={() => navigate('/search')}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
