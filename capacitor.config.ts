
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5596c1b51dbb4b24bc600f97a4e80233',
  appName: 'swipetopia-gift-battle',
  webDir: 'dist',
  server: {
    url: 'https://5596c1b5-1dbb-4b24-bc60-0f97a4e80233.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      releaseType: undefined,
    }
  }
};

export default config;
