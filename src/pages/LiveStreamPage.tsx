import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import LiveStreamService, { ZegoStreamConfig } from '@/services/livestream.service';
import { ChevronRight, Trash2, Paperclip, Smile, Send, MicOff, Mic, Camera, CameraOff, Settings, Users, Gift, DollarSign } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LiveStreamIndicator from '@/components/live/LiveStreamIndicator';
import BattleModeSelector from '@/components/live/BattleModeSelector';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

const LiveStreamPage = () => {
  const [streamID, setStreamID] = useState('');
  const [userID, setUserID] = useState(Math.floor(Math.random() * 10000).toString());
  const [displayName, setDisplayName] = useState(`User ${Math.floor(Math.random() * 1000)}`);
  const [roomID, setRoomID] = useState('default_room');
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enableCamera, setEnableCamera] = useState(true);
  const [enableMicrophone, setEnableMicrophone] = useState(true);
  const [localVideoView, setLocalVideoView] = useState<any>(null);
  const [remoteVideoView, setRemoteVideoView] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [battleMode, setBattleMode] = useState<'solo' | 'team'>('solo');
  const [volume, setVolume] = useState(50);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to the bottom of the chat on new messages
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = () => {
    if (chatInput.trim() !== '') {
      const newMessage: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        sender: displayName,
        message: chatInput,
        timestamp: new Date(),
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatInput('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const startLiveStream = async () => {
    if (!streamID) {
      toast({
        title: "Stream ID Required",
        description: "Please enter a stream ID to start streaming.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Initialize the Zego engine
      await LiveStreamService.init({
        appID: 123456789, // Replace with your actual App ID
        appSign: "your-app-sign", // Replace with your actual App Sign
        userID: userID,
        userName: displayName,
        roomID: roomID,
      });

      // Setup camera/microphone state
      await LiveStreamService.enableCamera(enableCamera);
      await LiveStreamService.enableMicrophone(enableMicrophone);

      // Start publishing
      await LiveStreamService.startPublishing(streamID, {
        camera: enableCamera,
        microphone: enableMicrophone
      });

      // Create local video view
      const localView = await LiveStreamService.getLocalVideoView();
      setLocalVideoView(localView);

      // Register for events
      await LiveStreamService.registerEventListener('roomUserUpdate', (roomID, updateType, userList) => {
        console.log('Room user update:', roomID, updateType, userList);
      });

      await LiveStreamService.registerEventListener('roomStreamUpdate', (roomID, updateType, streamList) => {
        console.log('Room stream update:', roomID, updateType, streamList);
      });

      setStreaming(true);
      setLoading(false);
    } catch (error) {
      console.error('Failed to start live stream:', error);
      toast({
        title: "Streaming Failed",
        description: "Failed to start the live stream. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const stopLiveStream = async () => {
    try {
      await LiveStreamService.stopPublishing();
      await LiveStreamService.leaveRoom();
      
      // Remove event listeners
      await LiveStreamService.removeEventListener('roomUserUpdate');
      await LiveStreamService.removeEventListener('roomStreamUpdate');
      
      setStreaming(false);
      setLocalVideoView(null);
    } catch (error) {
      console.error('Failed to stop live stream:', error);
    }
  };

  const toggleCamera = async () => {
    try {
      await LiveStreamService.enableCamera(!enableCamera);
      setEnableCamera(!enableCamera);
    } catch (error) {
      console.error('Failed to toggle camera:', error);
    }
  };

  const toggleMicrophone = async () => {
    try {
      await LiveStreamService.enableMicrophone(!enableMicrophone);
      setEnableMicrophone(!enableMicrophone);
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
    }
  };

  const switchCameraHandler = async () => {
    try {
      await LiveStreamService.switchCamera();
      toast({
        title: "Camera Switched",
        description: "Camera switched successfully.",
      });
    } catch (error) {
      console.error('Failed to switch camera:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Live Stream Page</h1>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="streamID">Stream ID</Label>
              <Input
                id="streamID"
                type="text"
                value={streamID}
                onChange={(e) => setStreamID(e.target.value)}
                placeholder="Enter Stream ID"
              />
            </div>
            <div>
              <Label htmlFor="userID">User ID</Label>
              <Input
                id="userID"
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                placeholder="Enter User ID"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter Display Name"
              />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center space-x-2">
            <Switch id="camera" checked={enableCamera} onCheckedChange={toggleCamera} />
            <Label htmlFor="camera">Enable Camera</Label>
            <Button variant="outline" size="sm" onClick={switchCameraHandler} disabled={!streaming}>
              Switch Camera
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="microphone" checked={enableMicrophone} onCheckedChange={toggleMicrophone} />
            <Label htmlFor="microphone">Enable Microphone</Label>
          </div>
          <Separator className="my-4" />
          {streaming ? (
            <Button onClick={stopLiveStream} disabled={loading} variant="destructive">
              Stop Live Stream
            </Button>
          ) : (
            <Button onClick={startLiveStream} disabled={loading}>
              Start Live Stream
            </Button>
          )}
          {loading && <p>Loading...</p>}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Local Video</h3>
            {localVideoView ? localVideoView : <p>Waiting to start stream...</p>}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Remote Video</h3>
            {remoteVideoView ? remoteVideoView : <p>No remote stream playing</p>}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Chat</h3>
            <div
              className="h-64 overflow-y-auto p-2 mb-2 bg-secondary rounded"
              ref={chatScrollRef}
            >
              {chatMessages.map((msg) => (
                <div key={msg.id} className="mb-1">
                  <span className="font-semibold">{msg.sender}:</span> {msg.message}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={sendMessage}><Send className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <Tabs defaultValue="general" className="w-full">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <div className="space-y-2">
                  <Label>Room ID</Label>
                  <Input type="text" value={roomID} onChange={(e) => setRoomID(e.target.value)} />
                </div>
              </TabsContent>
              <TabsContent value="audio">
                <div className="space-y-2">
                  <Label>Volume</Label>
                  <Slider
                    defaultValue={[volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                  />
                  <p className="text-sm text-muted-foreground">Current Volume: {volume}</p>
                </div>
              </TabsContent>
              <TabsContent value="video">
                <p>Video settings will be here</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveStreamPage;
