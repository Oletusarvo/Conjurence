'use client';

import { socket } from '@/socket';
import axios from 'axios';
import { useUserContext } from '../../users/providers/UserProvider';
import { useEventContext } from '../providers/EventProvider';
import { useEffect } from 'react';

/**Defines the logic for handling emited socket events related to an event.
 * Call at the top level of EventProvider.
 */
export function useEventProviderSocket({
  event,
  status,
  setStatus,
  setParticipantRecord,
  setParticipants,
  setMode,
}) {
  const { user } = useUserContext();

  const fetchParticipantRecord = async (signal: AbortSignal) => {
    try {
      const res = await axios.get('/api/users/get_participant_record', { signal });
      if (res.status === 200) {
        setParticipantRecord(res.data);
      }
    } finally {
      setStatus({
        ...status,
        participantRecordPending: false,
      });
    }
  };

  useEffect(() => {
    const roomName = `event:${event.id}`;
    socket.emit('join_room', roomName);
    const controller = new AbortController();
    const { signal } = controller;

    socket.on('participant_update', () => {
      setStatus({
        ...status,
        participantsPending: true,
      });

      const signal = controller.signal;
      axios
        .post('/api/events/get_join_requests', {
          data: {
            query: {
              event_id: event.id,
            },
          },
          signal,
        })
        .then(res => {
          if (res.status === 200) {
            setParticipants(res.data);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() =>
          setStatus({
            ...status,
            participantsPending: false,
          })
        );
    });

    socket.on('request_accepted', async data => {});

    socket.on('request_rejected', data => {
      if (user?.id === data.user.id) {
        setMode('rejected');
      }
    });

    socket.on('event_ended', () => {});

    return () => {
      socket.off('join_request');
      socket.off('event_ended');
      socket.off('request_accepted');
      socket.off('request_rejected');
      socket.emit('leave_room', roomName);
      controller.abort();
    };
  }, []);
}
