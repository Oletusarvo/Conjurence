import { socket } from '@/socket';
import { useEffect } from 'react';

/**
 * Takes the passed handlers and adds them as a socket.on-call on the global socket defined in socket.ts.
 * Also calls socket.off on the same handlers on unmount.
 */
export function useSocketHandlers(eventHandlers: Record<string, (...args: any[]) => void>) {
  useEffect(() => {
    for (const [event, handler] of Object.entries(eventHandlers)) {
      socket.on(event, handler);
    }

    return () => {
      for (const [event, handler] of Object.entries(eventHandlers)) {
        socket.off(event, handler);
      }
    };
  }, [JSON.stringify(eventHandlers)]);
}
