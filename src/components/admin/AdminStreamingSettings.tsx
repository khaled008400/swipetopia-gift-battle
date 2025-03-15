
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import StreamingAdminService from '@/services/streaming/admin.service';

const AdminStreamingSettings = () => {
  const [agoraAppId, setAgoraAppId] = useState('');
  const [agoraCertificate, setAgoraCertificate] = useState('');
  const [agoraEnabled, setAgoraEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch current streaming configuration
  const { data: config, isLoading, refetch } = useQuery({
    queryKey: ['streaming-config'],
    queryFn: StreamingAdminService.getStreamingConfig,
  });

  // Set state when data is loaded
  React.useEffect(() => {
    if (config) {
      setAgoraAppId(config.agora_app_id || '');
      setAgoraCertificate(config.agora_app_certificate || '');
      setAgoraEnabled(config.agora_enabled);
    }
  }, [config]);

  const handleUpdateSettings = async () => {
    try {
      setIsUpdating(true);
      await StreamingAdminService.updateAgoraSettings(
        agoraAppId,
        agoraCertificate,
        agoraEnabled
      );
      toast.success('Streaming settings updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update streaming settings');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agora.io Integration</CardTitle>
          <CardDescription>
            Configure Agora.io settings for live streaming and real-time communication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appId">App ID</Label>
            <Input
              id="appId"
              placeholder="Enter your Agora App ID"
              value={agoraAppId}
              onChange={(e) => setAgoraAppId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="certificate">App Certificate</Label>
            <Input
              id="certificate"
              type="password"
              placeholder="Enter your Agora App Certificate"
              value={agoraCertificate}
              onChange={(e) => setAgoraCertificate(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              This is used for generating secure tokens for user authentication
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableAgora">Enable Agora Integration</Label>
              <p className="text-xs text-gray-500">
                Toggle to enable or disable Agora services across the platform
              </p>
            </div>
            <Switch
              id="enableAgora"
              checked={agoraEnabled}
              onCheckedChange={setAgoraEnabled}
            />
          </div>
          
          <Button 
            onClick={handleUpdateSettings} 
            disabled={isUpdating || isLoading}
            className="mt-4"
          >
            {isUpdating ? 'Updating...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Streaming Limits</CardTitle>
          <CardDescription>
            Configure global streaming parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxDuration">Maximum Stream Duration (minutes)</Label>
            <Input
              id="maxDuration"
              type="number"
              placeholder="120"
              min={10}
              disabled
              value={config?.max_stream_duration || 120}
            />
            <p className="text-xs text-gray-500">
              The maximum time a stream can be active (Premium feature)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cooldown">Streamer Cooldown Period (minutes)</Label>
            <Input
              id="cooldown"
              type="number"
              placeholder="15"
              min={0}
              disabled
              value={config?.streamer_cooldown || 15}
            />
            <p className="text-xs text-gray-500">
              The required waiting period between streams (Premium feature)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStreamingSettings;
