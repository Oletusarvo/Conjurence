import { socket } from '@/socket';
import { useEffect } from 'react';

const roomUsage = new Map();

export function useSocketRoom(roomNames: string[]) {
  useEffect(() => {
    for (const room of roomNames) {
      const usageCount = roomUsage.get(room) || 0;

      if (usageCount === 0) {
        socket.emit('join_room', room);
      }

      roomUsage.set(room, usageCount + 1);
    }

    return () => {
      for (const room of roomNames) {
        const usageCount = roomUsage.get(room) - 1 || 0;
        roomUsage.set(room, usageCount);

        if (usageCount <= 0) {
          socket.emit('leave_room', room);
          roomUsage.delete(room);
        }
      }
    };
  }, [JSON.stringify(roomNames)]);
}
