
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { NotificationPreferences as NotificationPreferencesType } from "@/types/auth.types";
import { useToast } from "@/components/ui/use-toast";

interface NotificationPreferencesProps {
  initialPreferences: NotificationPreferencesType;
  onSave: (preferences: NotificationPreferencesType) => Promise<void>;
}

const NotificationPreferences = ({ initialPreferences, onSave }: NotificationPreferencesProps) => {
  const [preferences, setPreferences] = useState<NotificationPreferencesType>(initialPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(preferences);
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error saving preferences",
        description: "There was a problem saving your notification preferences.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full bg-app-gray-dark">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-app-yellow" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Manage which notifications you receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="battles" className="flex flex-col">
            <span>Battle Alerts</span>
            <span className="text-xs text-gray-400">Get notified about new battles and results</span>
          </Label>
          <Switch
            id="battles"
            checked={preferences.battles}
            onCheckedChange={(checked) => setPreferences({ ...preferences, battles: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="orders" className="flex flex-col">
            <span>Order Updates</span>
            <span className="text-xs text-gray-400">Get notified about your order status</span>
          </Label>
          <Switch
            id="orders"
            checked={preferences.orders}
            onCheckedChange={(checked) => setPreferences({ ...preferences, orders: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="messages" className="flex flex-col">
            <span>Messages</span>
            <span className="text-xs text-gray-400">Get notified about new messages</span>
          </Label>
          <Switch
            id="messages"
            checked={preferences.messages}
            onCheckedChange={(checked) => setPreferences({ ...preferences, messages: checked })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="followers" className="flex flex-col">
            <span>New Followers</span>
            <span className="text-xs text-gray-400">Get notified when someone follows you</span>
          </Label>
          <Switch
            id="followers"
            checked={preferences.followers}
            onCheckedChange={(checked) => setPreferences({ ...preferences, followers: checked })}
          />
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full mt-4 bg-app-yellow text-black hover:bg-app-yellow/90"
        >
          {isSaving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
