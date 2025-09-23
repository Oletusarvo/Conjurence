import type { CapacitorConfig } from '@capacitor/cli';
//const env = process.env.NODE_ENV || 'development';
const config: CapacitorConfig = {
  appId: 'com.onrender.conjurence',
  appName: 'Conjurence',
  webDir: 'out',
  server: {
    url: 'http://10.215.98.92:3000', // 👈 your live site URL
    cleartext: true, // allow HTTP if not using HTTPS (not recommended in prod)
  },
};

export default config;
