
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DatabaseDebug: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from('videos').select('count').limit(1);
      
      if (error) {
        console.error('Database connection error:', error);
        setDbStatus('error');
        setErrorDetails(error.message);
        return;
      }
      
      setDbStatus('connected');
      fetchTables();
    } catch (err: any) {
      console.error('Unexpected error checking database:', err);
      setDbStatus('error');
      setErrorDetails(err.message);
    }
  };

  const fetchTables = async () => {
    try {
      // This is a simple query to get table names - note this may not work depending on permissions
      const { data, error } = await supabase.rpc('get_tables');
      
      if (!error && data) {
        setTables(data);
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
  };
  
  const createVideosTable = async () => {
    try {
      // This is to test if we can create the videos table - in a real app you'd use migrations
      const { error } = await supabase.rpc('create_videos_table');
      
      if (error) {
        console.error('Error creating videos table:', error);
        setErrorDetails(error.message);
        return;
      }
      
      alert('Videos table created successfully');
      checkDatabaseConnection();
    } catch (err: any) {
      console.error('Error creating table:', err);
      setErrorDetails(err.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Connection Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Connection Status:</p>
            <p className={`text-sm ${dbStatus === 'connected' ? 'text-green-500' : dbStatus === 'error' ? 'text-red-500' : 'text-yellow-500'}`}>
              {dbStatus === 'connected' ? 'Connected' : dbStatus === 'error' ? 'Error' : 'Checking...'}
            </p>
            {errorDetails && (
              <p className="text-sm text-red-500 mt-1">{errorDetails}</p>
            )}
          </div>

          <div>
            <p className="font-medium">Authentication Status:</p>
            <p className={`text-sm ${isAuthenticated ? 'text-green-500' : 'text-red-500'}`}>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </p>
            {user && (
              <div className="text-sm mt-1">
                <p>User ID: {user.id}</p>
                <p>Email: {user.email}</p>
                <p>Role: {Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}</p>
              </div>
            )}
          </div>

          {tables.length > 0 && (
            <div>
              <p className="font-medium">Available Tables:</p>
              <ul className="text-sm list-disc list-inside">
                {tables.map((table, index) => (
                  <li key={index}>{table}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4">
            <Button onClick={() => checkDatabaseConnection()}>Refresh Status</Button>
            {dbStatus === 'error' && errorDetails?.includes('relation "videos" does not exist') && (
              <Button 
                variant="destructive" 
                onClick={createVideosTable} 
                className="ml-2"
              >
                Create Videos Table
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseDebug;
