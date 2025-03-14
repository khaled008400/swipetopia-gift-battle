
import { Platform } from 'react-native';
import ZegoExpressEngine from 'zego-express-engine-reactnative';

export interface ZegoStreamConfig {
  appID: number;
  appSign: string;
  userID: string;
  userName: string;
  roomID: string;
  streamID?: string;
}

class LiveStreamService {
  private engine: any;
  private isInitialized: boolean = false;
  private config: ZegoStreamConfig | null = null;

  async init(config: ZegoStreamConfig): Promise<void> {
    if (this.isInitialized) {
      console.log('ZegoExpressEngine already initialized');
      return;
    }

    this.config = config;
    try {
      // Create engine with correct parameters based on SDK documentation
      this.engine = ZegoExpressEngine.createEngine(
        config.appID, 
        config.appSign,
        true, // Use boolean instead of number for the third parameter
        { 
          // Advanced config as last parameter
          logConfig: {
            logPath: '',
            logSize: 0,
          },
          scenario: 0, // General scenario
        }
      );
      
      await this.engine.loginRoom(config.roomID, config.userID, config.userName);
      this.isInitialized = true;
      console.log('ZegoExpressEngine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ZegoExpressEngine:', error);
      throw error;
    }
  }

  async startPublishing(streamID: string, config: { camera?: boolean, microphone?: boolean } = {}): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      throw new Error('ZegoExpressEngine not initialized');
    }

    try {
      const useCamera = config.camera !== false;
      const useMicrophone = config.microphone !== false;

      await this.engine.enableCamera(useCamera);
      await this.engine.muteMicrophone(!useMicrophone);
      
      await this.engine.startPublishingStream(streamID);
      console.log('Started publishing stream:', streamID);
    } catch (error) {
      console.error('Failed to start publishing:', error);
      throw error;
    }
  }

  async stopPublishing(): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      return;
    }

    try {
      await this.engine.stopPublishingStream();
      console.log('Stopped publishing stream');
    } catch (error) {
      console.error('Failed to stop publishing:', error);
      throw error;
    }
  }

  async startPlaying(streamID: string, canvas: any): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      throw new Error('ZegoExpressEngine not initialized');
    }

    try {
      await this.engine.startPlayingStream(streamID, canvas);
      console.log('Started playing stream:', streamID);
    } catch (error) {
      console.error('Failed to start playing:', error);
      throw error;
    }
  }

  async stopPlaying(streamID: string): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      return;
    }

    try {
      await this.engine.stopPlayingStream(streamID);
      console.log('Stopped playing stream:', streamID);
    } catch (error) {
      console.error('Failed to stop playing:', error);
      throw error;
    }
  }

  async switchCamera(): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      throw new Error('ZegoExpressEngine not initialized');
    }

    try {
      await this.engine.switchCamera();
      console.log('Camera switched');
    } catch (error) {
      console.error('Failed to switch camera:', error);
      throw error;
    }
  }

  async setVideoConfig(width: number, height: number, fps: number, bitrate: number): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      throw new Error('ZegoExpressEngine not initialized');
    }

    try {
      await this.engine.setVideoConfig({
        width,
        height,
        bitrate,
        fps
      });
      console.log('Video config set');
    } catch (error) {
      console.error('Failed to set video config:', error);
      throw error;
    }
  }

  async leaveRoom(): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      return;
    }

    try {
      await this.engine.logoutRoom();
      console.log('Left room');
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to leave room:', error);
      throw error;
    }
  }

  async getEngine() {
    if (!this.isInitialized || !this.engine) {
      throw new Error('ZegoExpressEngine not initialized');
    }
    return this.engine;
  }

  async getLocalVideoView(): Promise<any> {
    if (!this.isInitialized || !this.engine) {
      throw new Error('ZegoExpressEngine not initialized');
    }
    return this.engine.createLocalView();
  }

  async getRemoteVideoView(streamID: string): Promise<any> {
    if (!this.isInitialized || !this.engine) {
      throw new Error('ZegoExpressEngine not initialized');
    }
    return this.engine.createRemoteView(streamID);
  }

  async enableCamera(enable: boolean): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      throw new Error('ZegoExpressEngine not initialized');
    }
    await this.engine.enableCamera(enable);
  }

  async enableMicrophone(enable: boolean): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      throw new Error('ZegoExpressEngine not initialized');
    }
    await this.engine.muteMicrophone(!enable);
  }

  async registerEventListener(event: string, callback: Function): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      throw new Error('ZegoExpressEngine not initialized');
    }
    this.engine.on(event, callback);
  }

  async removeEventListener(event: string, callback?: Function): Promise<void> {
    if (!this.isInitialized || !this.engine) {
      return;
    }
    if (callback) {
      this.engine.off(event, callback);
    } else {
      this.engine.off(event);
    }
  }
}

export default new LiveStreamService();
