import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ZegoStreamConfig } from '@/services/livestream.service';
import livestreamService from '@/services/livestream.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/components/ui/use-toast';
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LiveStreamPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [streamID, setStreamID] = useState('');
  const [appID, setAppID] = useState<number | null>(null);
  const [appSign, setAppSign] = useState('');
  const [userID, setUserID] = useState('');
  const [userName, setUserName] = useState('');
  const [roomID, setRoomID] = useState('');
  const [localView, setLocalView] = useState<any>(null);
  const [remoteView, setRemoteView] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [videoWidth, setVideoWidth] = useState(360);
  const [videoHeight, setVideoHeight] = useState(640);
  const [videoFPS, setVideoFPS] = useState(15);
  const [videoBitrate, setVideoBitrate] = useState(600);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // Load settings from local storage
    const storedAppID = localStorage.getItem('zego_app_id');
    const storedAppSign = localStorage.getItem('zego_app_sign');
    const storedUserID = localStorage.getItem('zego_user_id');
    const storedUserName = localStorage.getItem('zego_user_name');
    const storedRoomID = localStorage.getItem('zego_room_id');
    const storedStreamID = localStorage.getItem('zego_stream_id');

    if (storedAppID) setAppID(Number(storedAppID));
    if (storedAppSign) setAppSign(storedAppSign);
    if (storedUserID) setUserID(storedUserID);
    if (storedUserName) setUserName(storedUserName);
    if (storedRoomID) setRoomID(storedRoomID);
    if (storedStreamID) setStreamID(storedStreamID);

    // Initialize ZegoCloud SDK when the component mounts
    const initialize = async () => {
      if (appID && appSign && userID && userName && roomID) {
        const config: ZegoStreamConfig = {
          appID: appID,
          appSign: appSign,
          userID: userID,
          userName: userName,
          roomID: roomID,
        };

        try {
          await livestreamService.init(config);
          console.log('Live stream service initialized');
        } catch (error) {
          console.error('Failed to initialize live stream service:', error);
          toast({
            title: "Initialization Error",
            description: "Failed to initialize the live stream service.",
            variant: "destructive",
          });
        }
      }
    };

    initialize();

    return () => {
      // Clean up when the component unmounts
      livestreamService.leaveRoom();
    };
  }, []);

  useEffect(() => {
    // Save settings to local storage whenever they change
    localStorage.setItem('zego_app_id', String(appID));
    localStorage.setItem('zego_app_sign', appSign);
    localStorage.setItem('zego_user_id', userID);
    localStorage.setItem('zego_user_name', userName);
    localStorage.setItem('zego_room_id', roomID);
    localStorage.setItem('zego_stream_id', streamID);
  }, [appID, appSign, userID, userName, roomID, streamID]);

  const handleStartPublishing = async () => {
    if (!streamID) {
      alert('Please enter a stream ID.');
      return;
    }

    try {
      await livestreamService.startPublishing(streamID, { camera: cameraEnabled, microphone: microphoneEnabled });
      setPublishing(true);

      const newLocalView = await livestreamService.getLocalVideoView();
      setLocalView(newLocalView);

      if (localVideoRef.current) {
        localVideoRef.current.innerHTML = '';
        localVideoRef.current.appendChild(newLocalView);
      }

      toast({
        title: "Publishing Started",
        description: `Successfully started publishing stream: ${streamID}.`,
      });
    } catch (error) {
      console.error('Failed to start publishing:', error);
      toast({
        title: "Publishing Error",
        description: "Failed to start publishing the stream.",
        variant: "destructive",
      });
    }
  };

  const handleStopPublishing = async () => {
    try {
      await livestreamService.stopPublishing();
      setPublishing(false);
      setLocalView(null);

      if (localVideoRef.current) {
        localVideoRef.current.innerHTML = '';
      }

      toast({
        title: "Publishing Stopped",
        description: "Successfully stopped publishing the stream.",
      });
    } catch (error) {
      console.error('Failed to stop publishing:', error);
      toast({
        title: "Stop Error",
        description: "Failed to stop publishing the stream.",
        variant: "destructive",
      });
    }
  };

  const handleStartPlaying = async () => {
    if (!streamID) {
      alert('Please enter a stream ID.');
      return;
    }

    try {
      const newRemoteView = await livestreamService.getRemoteVideoView(streamID);
      setRemoteView(newRemoteView);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = '';
        remoteVideoRef.current.appendChild(newRemoteView);
      }

      await livestreamService.startPlaying(streamID, newRemoteView);
      setPlaying(true);

      toast({
        title: "Playing Started",
        description: `Successfully started playing stream: ${streamID}.`,
      });
    } catch (error) {
      console.error('Failed to start playing:', error);
      toast({
        title: "Playing Error",
        description: "Failed to start playing the stream.",
        variant: "destructive",
      });
    }
  };

  const handleStopPlaying = async () => {
    try {
      await livestreamService.stopPlaying(streamID);
      setPlaying(false);
      setRemoteView(null);

      if (remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = '';
      }

      toast({
        title: "Playing Stopped",
        description: "Successfully stopped playing the stream.",
      });
    } catch (error) {
      console.error('Failed to stop playing:', error);
      toast({
        title: "Stop Error",
        description: "Failed to stop playing the stream.",
        variant: "destructive",
      });
    }
  };

  const handleSwitchCamera = async () => {
    try {
      await livestreamService.switchCamera();
      toast({
        title: "Camera Switched",
        description: "Successfully switched camera.",
      });
    } catch (error) {
      console.error('Failed to switch camera:', error);
      toast({
        title: "Switch Error",
        description: "Failed to switch camera.",
        variant: "destructive",
      });
    }
  };

  const handleCameraToggle = async (checked: boolean) => {
    try {
      await livestreamService.enableCamera(checked);
      setCameraEnabled(checked);
      toast({
        title: "Camera Toggled",
        description: `Camera ${checked ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error('Failed to toggle camera:', error);
      toast({
        title: "Camera Toggle Error",
        description: "Failed to toggle camera.",
        variant: "destructive",
      });
    }
  };

  const handleMicrophoneToggle = async (checked: boolean) => {
    try {
      await livestreamService.enableMicrophone(checked);
      setMicrophoneEnabled(checked);
      toast({
        title: "Microphone Toggled",
        description: `Microphone ${checked ? 'enabled' : 'disabled'} successfully.`,
      });
    } catch (error) {
      console.error('Failed to toggle microphone:', error);
      toast({
        title: "Microphone Toggle Error",
        description: "Failed to toggle microphone.",
        variant: "destructive",
      });
    }
  };

  const handleSetVideoConfig = async () => {
    try {
      await livestreamService.setVideoConfig(videoWidth, videoHeight, videoFPS, videoBitrate);
      toast({
        title: "Video Config Set",
        description: "Successfully set video configuration.",
      });
    } catch (error) {
      console.error('Failed to set video config:', error);
      toast({
        title: "Video Config Error",
        description: "Failed to set video configuration.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Live Stream Settings</CardTitle>
          <CardDescription>Configure your live stream settings here.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appID">App ID</Label>
              <Input
                type="number"
                id="appID"
                value={appID || ''}
                onChange={(e) => setAppID(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="appSign">App Sign</Label>
              <Input
                type="text"
                id="appSign"
                value={appSign}
                onChange={(e) => setAppSign(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userID">User ID</Label>
              <Input
                type="text"
                id="userID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="userName">User Name</Label>
              <Input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomID">Room ID</Label>
              <Input
                type="text"
                id="roomID"
                value={roomID}
                onChange={(e) => setRoomID(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="streamID">Stream ID</Label>
              <Input
                type="text"
                id="streamID"
                value={streamID}
                onChange={(e) => setStreamID(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Video Configuration</CardTitle>
          <CardDescription>Adjust video settings for optimal streaming.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="videoWidth">Width</Label>
              <Input
                type="number"
                id="videoWidth"
                value={videoWidth}
                onChange={(e) => setVideoWidth(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="videoHeight">Height</Label>
              <Input
                type="number"
                id="videoHeight"
                value={videoHeight}
                onChange={(e) => setVideoHeight(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="videoFPS">FPS</Label>
              <Input
                type="number"
                id="videoFPS"
                value={videoFPS}
                onChange={(e) => setVideoFPS(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="videoBitrate">Bitrate (kbps)</Label>
              <Input
                type="number"
                id="videoBitrate"
                value={videoBitrate}
                onChange={(e) => setVideoBitrate(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={handleSetVideoConfig}>Set Video Configuration</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
          <CardDescription>Start publishing or playing the stream.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="camera">Enable Camera</Label>
            <Switch id="camera" checked={cameraEnabled} onCheckedChange={handleCameraToggle} />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="microphone">Enable Microphone</Label>
            <Switch id="microphone" checked={microphoneEnabled} onCheckedChange={handleMicrophoneToggle} />
          </div>
          <div className="flex space-x-2">
            {!publishing ? (
              <Button onClick={handleStartPublishing}>Start Publishing</Button>
            ) : (
              <Button variant="destructive" onClick={handleStopPublishing}>Stop Publishing</Button>
            )}
            <Button onClick={handleSwitchCamera}>Switch Camera</Button>
          </div>
          {!playing ? (
            <Button onClick={handleStartPlaying}>Start Playing</Button>
          ) : (
            <Button variant="destructive" onClick={handleStopPlaying}>Stop Playing</Button>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Local Video</CardTitle>
            <CardDescription>Your local stream preview.</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={localVideoRef} className="w-full h-64 bg-gray-100" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Remote Video</CardTitle>
            <CardDescription>The remote stream you are playing.</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={remoteVideoRef} className="w-full h-64 bg-gray-100" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveStreamPage;
