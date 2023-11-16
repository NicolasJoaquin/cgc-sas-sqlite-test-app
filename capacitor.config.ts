import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cgc.sas.sqlite.test.app',
  appName: 'cgc-sas-sqlite-test-app',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
