
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StreamingAdminService } from '@/services/streaming';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, AlertTriangle, Check } from 'lucide-react';

const AdminStreamingSettings = () => {
  const [agoraAppId, setAgoraAppId] = useState('');
  const [agoraAppCertificate, setAgoraAppCertificate] = useState('');
  const [agoraEnabled, setAgoraEnabled] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch current streaming settings
  const { data: streamingConfig, isLoading } = useQuery({
    queryKey: ['streamingConfig'],
    queryFn: StreamingAdminService.getStreamingConfig,
  });
  
  // Set form values when data is loaded
  useEffect(() => {
    if (streamingConfig) {
      setAgoraAppId(streamingConfig.agora_app_id || '');
      setAgoraAppCertificate(streamingConfig.agora_app_certificate || '');
      setAgoraEnabled(streamingConfig.agora_enabled || false);
    }
  }, [streamingConfig]);
  
  // Update Agora settings mutation
  const updateAgoraMutation = useMutation({
    mutationFn: () => 
      StreamingAdminService.updateAgoraSettings(agoraAppId, agoraAppCertificate, agoraEnabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streamingConfig'] });
      toast({
        title: "Settings updated",
        description: "Agora API settings have been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating settings",
        description: error.message || "Failed to update Agora API settings",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgoraMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Streaming Platform Settings</h2>
      </div>
      
      <Tabs defaultValue="agora" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agora">Agora API</TabsTrigger>
          <TabsTrigger value="streaming">Stream Settings</TabsTrigger>
          <TabsTrigger value="battles">Battle Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agora" className="space-y-4">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Agora API Configuration</CardTitle>
                <CardDescription>
                  Configure the Agora API settings for live streaming functionality
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="appId">App ID</Label>
                  <Input
                    id="appId"
                    value={agoraAppId}
                    onChange={(e) => setAgoraAppId(e.target.value)}
                    placeholder="Enter Agora App ID"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="appCertificate">App Certificate</Label>
                  <Input
                    id="appCertificate"
                    value={agoraAppCertificate}
                    onChange={(e) => setAgoraAppCertificate(e.target.value)}
                    type="password"
                    placeholder="Enter Agora App Certificate"
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="agoraEnabled"
                    checked={agoraEnabled}
                    onCheckedChange={setAgoraEnabled}
                  />
                  <Label htmlFor="agoraEnabled">Enable Agora Integration</Label>
                </div>
                
                {!agoraAppId && !agoraAppCertificate && (
                  <div className="bg-yellow-50 p-3 rounded-md flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <p className="text-yellow-700 text-sm">
                      You need to configure Agora API credentials for live streaming to work.
                    </p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  disabled={updateAgoraMutation.isPending}
                  className="ml-auto"
                >
                  {updateAgoraMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          {streamingConfig && (
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${agoraEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p>Agora Integration: {agoraEnabled ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${agoraAppId ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p>Agora App ID: {agoraAppId ? 'Configured' : 'Not Configured'}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${agoraAppCertificate ? 'bg-green-500' : 'bg-red-500'}`} />
                    <p>Agora Certificate: {agoraAppCertificate ? 'Configured' : 'Not Configured'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="streaming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Streaming Settings</CardTitle>
              <CardDescription>Configure global settings for live streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxDuration">Maximum Stream Duration (minutes)</Label>
                    <Input id="maxDuration" type="number" defaultValue={120} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cooldown">Streamer Cooldown Period (minutes)</Label>
                    <Input id="cooldown" type="number" defaultValue={15} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Stream Content Moderation</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="moderationEnabled" defaultChecked />
                    <Label htmlFor="moderationEnabled">Enable Automatic Content Moderation</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="battles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Battle Configuration</CardTitle>
              <CardDescription>Configure settings for streamer battles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="battleDuration">Default Battle Duration (minutes)</Label>
                    <Input id="battleDuration" type="number" defaultValue={10} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="battleCooldown">Battle Cooldown Period (minutes)</Label>
                    <Input id="battleCooldown" type="number" defaultValue={60} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Battle Features</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="enableGifts" defaultChecked />
                      <Label htmlFor="enableGifts">Enable Gifts During Battles</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="enableSpecialEffects" defaultChecked />
                      <Label htmlFor="enableSpecialEffects">Enable Special Effects for Battles</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStreamingSettings;
