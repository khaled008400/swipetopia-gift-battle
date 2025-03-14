
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, Key, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AdminService from '@/services/admin.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AdminStreamAPI = () => {
  const [appID, setAppID] = useState<string>('');
  const [serverSecret, setServerSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing API settings
  const { data: apiSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['streamAPISettings'],
    queryFn: () => AdminService.getStreamAPISettings(),
  });

  // Update settings when data is loaded
  useEffect(() => {
    if (apiSettings) {
      setAppID(apiSettings.appID || '');
      setServerSecret(apiSettings.serverSecret || '');
    }
  }, [apiSettings]);

  // Save API settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: (data: { appID: string, serverSecret: string }) => 
      AdminService.saveStreamAPISettings(data.appID, data.serverSecret),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streamAPISettings'] });
      toast({
        title: "Settings saved",
        description: "ZegoCloud API settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save ZegoCloud API settings.",
        variant: "destructive",
      });
    },
  });

  // Test connection mutation
  const testConnectionMutation = useMutation({
    mutationFn: (data: { appID: string, serverSecret: string }) => 
      AdminService.testStreamAPIConnection(data.appID, data.serverSecret),
    onSuccess: () => {
      setTestStatus('success');
      toast({
        title: "Connection successful",
        description: "Successfully connected to ZegoCloud API.",
      });
    },
    onError: () => {
      setTestStatus('error');
      toast({
        title: "Connection failed",
        description: "Failed to connect to ZegoCloud API. Please check your credentials.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  const handleSaveSettings = () => {
    if (!appID || !serverSecret) {
      toast({
        title: "Validation error",
        description: "Please enter both App ID and Server Secret.",
        variant: "destructive",
      });
      return;
    }

    saveSettingsMutation.mutate({ appID, serverSecret });
  };

  const handleTestConnection = () => {
    if (!appID || !serverSecret) {
      toast({
        title: "Validation error",
        description: "Please enter both App ID and Server Secret to test the connection.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTestStatus('testing');
    testConnectionMutation.mutate({ appID, serverSecret });
  };

  if (isLoadingSettings) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Live Streaming API Configuration</h2>
      <p className="text-muted-foreground">
        Configure your ZegoCloud live streaming API credentials. These are required to enable live streaming in your application.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            ZegoCloud API Credentials
          </CardTitle>
          <CardDescription>
            Enter your ZegoCloud API credentials. You can find these in your ZegoCloud developer console.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app-id">App ID</Label>
            <Input
              id="app-id"
              value={appID}
              onChange={(e) => setAppID(e.target.value)}
              placeholder="Enter your ZegoCloud App ID"
            />
            <p className="text-xs text-muted-foreground">Your unique ZegoCloud application identifier</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="server-secret">Server Secret</Label>
            <Input
              id="server-secret"
              value={serverSecret}
              onChange={(e) => setServerSecret(e.target.value)}
              type="password"
              placeholder="Enter your ZegoCloud Server Secret"
            />
            <p className="text-xs text-muted-foreground">The server secret used for authentication</p>
          </div>

          {testStatus === 'success' && (
            <Alert className="bg-green-50 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Connection successful</AlertTitle>
              <AlertDescription>
                Your ZegoCloud API credentials are valid and working correctly.
              </AlertDescription>
            </Alert>
          )}

          {testStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection failed</AlertTitle>
              <AlertDescription>
                Unable to connect to ZegoCloud API with the provided credentials. Please check and try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={isLoading || !appID || !serverSecret}
          >
            {isLoading && testStatus === 'testing' ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={saveSettingsMutation.isPending || !appID || !serverSecret}
          >
            {saveSettingsMutation.isPending ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Keep your Server Secret secure and do not expose it in client-side code.</li>
            <li>Implement proper authentication mechanisms for your live streaming sessions.</li>
            <li>Regularly rotate your Server Secret to maintain security.</li>
            <li>Use server-side token generation for additional security.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStreamAPI;
