
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import StreamingAdminService from "@/services/streaming/admin.service";
import { useQuery, useMutation } from "@tanstack/react-query";

const AdminStreamingSettings = () => {
  const { toast } = useToast();
  const [agoraAppId, setAgoraAppId] = useState("");
  const [agoraAppCertificate, setAgoraAppCertificate] = useState("");
  const [agoraEnabled, setAgoraEnabled] = useState(true);

  // Query to fetch streaming configuration
  const { data: streamingConfig, isLoading, error } = useQuery({
    queryKey: ["streamingConfig"],
    queryFn: StreamingAdminService.getStreamingConfig,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: { appId: string; appCertificate: string; enabled: boolean }) => 
      StreamingAdminService.updateAgoraSettings(
        data.appId, 
        data.appCertificate, 
        data.enabled
      ),
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "The streaming settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating settings",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (streamingConfig) {
      setAgoraAppId(streamingConfig.agora_app_id || "");
      setAgoraAppCertificate(streamingConfig.agora_app_certificate || "");
      setAgoraEnabled(streamingConfig.agora_enabled);
    }
  }, [streamingConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({
      appId: agoraAppId,
      appCertificate: agoraAppCertificate,
      enabled: agoraEnabled,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-300">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Settings</CardTitle>
          <CardDescription>
            Unable to load streaming settings. Please try refreshing the page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agora Integration Settings</CardTitle>
          <CardDescription>
            Configure the Agora integration for video streaming functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appId">Agora App ID</Label>
              <Input
                id="appId"
                value={agoraAppId}
                onChange={(e) => setAgoraAppId(e.target.value)}
                placeholder="Enter your Agora App ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appCertificate">Agora App Certificate</Label>
              <Input
                id="appCertificate"
                value={agoraAppCertificate}
                onChange={(e) => setAgoraAppCertificate(e.target.value)}
                type="password"
                placeholder="Enter your Agora App Certificate"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enabled" className="cursor-pointer">
                Enable Agora Streaming
              </Label>
              <Switch
                id="enabled"
                checked={agoraEnabled}
                onCheckedChange={setAgoraEnabled}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stream Limits</CardTitle>
          <CardDescription>Configure stream duration and cooldown limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Maximum Stream Duration</Label>
              <span className="font-medium">
                {streamingConfig?.max_stream_duration || 120} minutes
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Label>Streamer Cooldown Period</Label>
              <span className="font-medium">
                {streamingConfig?.streamer_cooldown || 15} minutes
              </span>
            </div>
            <Button variant="outline" className="w-full">
              Configure Limits
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStreamingSettings;
