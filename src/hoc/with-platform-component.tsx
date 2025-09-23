import { Capacitor } from '@capacitor/core';

export function withPlatformComponent(ServerComponent, ClientComponent) {
  return props => {
    if (!Capacitor.isNativePlatform()) {
      return <ServerComponent {...props} />;
    } else {
      return <ClientComponent {...props} />;
    }
  };
}
