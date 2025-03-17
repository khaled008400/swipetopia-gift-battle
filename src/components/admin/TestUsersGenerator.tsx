
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createTestUsers } from '@/integrations/supabase/client';
import { AlertCircle, Check, UserPlus } from 'lucide-react';

const TestUsersGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateUsers = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    try {
      await createTestUsers();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create test users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-medium">Test Users Generator</h3>
          <p className="text-sm text-muted-foreground">
            Create sample users with different roles for testing
          </p>
        </div>
        <Button 
          onClick={handleGenerateUsers} 
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin mr-2">⌛</span>
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Generate Test Users
        </Button>
      </div>
      
      {success && (
        <Alert className="bg-green-800 border-green-700">
          <Check className="h-4 w-4 text-green-400" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Test users have been created with the following credentials:
            <ul className="mt-2 list-disc list-inside">
              <li>Admin: admin@example.com / adminpassword</li>
              <li>Seller: seller@example.com / sellerpassword</li>
              <li>Streamer: streamer@example.com / streamerpassword</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="bg-red-800 border-red-700">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TestUsersGenerator;
