
import api from './api';
import { ZegoExpressEngine } from 'zego-express-engine-reactnative';

export interface StreamSettings {
  appID: string;
  serverSecret: string;
}

export interface StreamUser {
  userID: string;
  userName: string;
  avatar?: string;
}

export interface RoomInfo {
  roomID: string;
  roomName: string;
  hostUserID: string;
  streamID: string;
  startTime: number;
}

export class ZegoLiveStreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZegoLiveStreamError';
  }
}

class LiveStreamService {
  private engine: any = null;
  private appID: string = '';
  private initialized: boolean = false;

  // Initialize the ZegoCloud SDK
  async initialize(): Promise<void> {
    try {
      // Fetch API settings from backend
      const response = await api.get('/stream-settings');
      if (!response.data || !response.data.appID) {
        throw new ZegoLiveStreamError('Stream API settings not configured');
      }

      this.appID = response.data.appID;
      
      // Create and initialize the ZegoExpressEngine
      this.engine = ZegoExpressEngine.createEngine(
        parseInt(this.appID), 
        response.data.serverSecret,
        { logConfig: { logLevel: 'error' } }
      );

      this.initialized = true;
      console.log('ZegoCloud SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ZegoCloud SDK:', error);
      throw new ZegoLiveStreamError('Failed to initialize live streaming engine');
    }
  }

  // Check if the engine is initialized
  isInitialized(): boolean {
    return this.initialized;
  }

  // Login to a room as a user
  async loginRoom(roomID: string, user: StreamUser, token: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      await this.engine.loginRoom(
        roomID,
        token,
        { userID: user.userID, userName: user.userName },
        { userUpdate: true }
      );
      console.log(`Logged into room ${roomID} as ${user.userName}`);
    } catch (error) {
      console.error('Failed to login to room:', error);
      throw new ZegoLiveStreamError('Failed to join the live stream room');
    }
  }

  // Start a live stream as a host
  async startLiveStream(roomInfo: RoomInfo, user: StreamUser): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Create a local stream
      await this.engine.startPreview({
        canvas: document.getElementById('local-video')
      });
      
      // Start publishing
      await this.engine.startPublishingStream(roomInfo.streamID);
      
      console.log(`Started live stream in room ${roomInfo.roomID} with stream ID ${roomInfo.streamID}`);
    } catch (error) {
      console.error('Failed to start live stream:', error);
      throw new ZegoLiveStreamError('Failed to start the live stream');
    }
  }

  // Watch a live stream as a viewer
  async watchLiveStream(roomID: string, streamID: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Start playing the remote stream
      await this.engine.startPlayingStream(streamID, {
        canvas: document.getElementById('remote-video')
      });
      
      console.log(`Started watching stream ${streamID} in room ${roomID}`);
    } catch (error) {
      console.error('Failed to watch live stream:', error);
      throw new ZegoLiveStreamError('Failed to watch the live stream');
    }
  }

  // Stop a live stream (for host)
  async stopLiveStream(streamID: string): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      await this.engine.stopPublishingStream();
      await this.engine.stopPreview();
      console.log(`Stopped live stream with ID ${streamID}`);
    } catch (error) {
      console.error('Failed to stop live stream:', error);
      throw new ZegoLiveStreamError('Failed to stop the live stream');
    }
  }

  // Stop watching a live stream (for viewer)
  async stopWatchingStream(streamID: string): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      await this.engine.stopPlayingStream(streamID);
      console.log(`Stopped watching stream with ID ${streamID}`);
    } catch (error) {
      console.error('Failed to stop watching stream:', error);
      throw new ZegoLiveStreamError('Failed to stop watching the stream');
    }
  }

  // Leave the room
  async leaveRoom(roomID: string): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      await this.engine.logoutRoom(roomID);
      console.log(`Left room ${roomID}`);
    } catch (error) {
      console.error('Failed to leave room:', error);
      throw new ZegoLiveStreamError('Failed to leave the room');
    }
  }

  // Clean up and destroy the engine
  async destroy(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      this.engine.destroyEngine();
      this.engine = null;
      this.initialized = false;
      console.log('ZegoCloud engine destroyed');
    } catch (error) {
      console.error('Failed to destroy ZegoCloud engine:', error);
    }
  }

  // Generate a token for authentication (typically done on the server)
  // This is a placeholder and should be implemented securely on the backend
  async generateToken(userID: string, roomID: string, role: number): Promise<string> {
    try {
      const response = await api.post('/generate-zego-token', {
        userID,
        roomID,
        role
      });
      return response.data.token;
    } catch (error) {
      console.error('Failed to generate token:', error);
      throw new ZegoLiveStreamError('Failed to generate authentication token');
    }
  }
}

export default new LiveStreamService();
