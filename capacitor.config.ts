import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'shw',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  cordova: {
    preferences: {
      orientation: 'portrait',
      SplashScreen: 'screen',
      ShowSplashScreenSpinner: 'false',
      StatusBarOverlaysWebView: 'false',
      StatusBarBackgroundColor: '#141414',
      BackgroundColor: '0xff141414',
    },
  },
};

export default config;
