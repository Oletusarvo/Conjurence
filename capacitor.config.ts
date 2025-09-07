import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.onrender.conjurence',
  appName: 'Conjurence',
  webDir: 'public',
  server: {
    url: 'https://conjurence.onrender.com', // 👈 your live site URL
    cleartext: true, // allow HTTP if not using HTTPS (not recommended in prod)
  },
};

export default config;
