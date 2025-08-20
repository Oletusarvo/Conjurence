'use client';

import { TabsProvider } from '@/providers/TabsProvider';
import { TabButton } from '../../../components/TabButton';
import { useEffect, useState } from 'react';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { acceptJoinRequestAction } from '@/features/attendance/actions/experimental/acceptJoinRequestAction';
import { Spinner } from '../../../components/Spinner';
import { AtSign, Check, Star, X } from 'lucide-react';
import { StatusBadge } from '../../../components/StatusBadge';
import { useEventContext } from '@/features/events/providers/EventProvider';
import { rejectJoinRequestAction } from '@/features/attendance/actions/experimental/rejectJoinRequestAction';
import { useSocketHandlers } from '@/hooks/useSocketHandlers';
import { useSocketRoom } from '@/hooks/useSocketRoom';
import { List } from '@/components/List';

export function AttendantList({ initialAttendants }) {
  const { event } = useEventContext();
  const { user } = useUserContext();
  const [currentTab, setCurrentTab] = useState(0);
  const [attendants, setAttendants] = useState(initialAttendants);

  const joined = attendants?.filter(p => p.status === 'joined' || p.status === 'host');
  const pending = attendants?.filter(p => p.status === 'pending');

  const [hasNewRequests, setHasNewRequests] = useState(pending?.length > 0 || false);
  const host = attendants.find(p => p.status === 'host')?.username;

  useSocketRoom([`event:${event.id}`]);
  useSocketHandlers({
    'event:join_request': ({ request }) => {
      setAttendants([request, ...attendants]);
    },
  });

  useEffect(() => {
    if (pending.length == 0) return;
    setHasNewRequests(true);
  }, [JSON.stringify(pending)]);

  return (
    <div className='flex flex-col gap-2 overflow-y-scroll'>
      <TabsProvider onChange={state => setCurrentTab(state)}>
        <div className='flex w-full'>
          <TabsProvider.Trigger tabIndex={0}>
            <TabButton>Osallistujat</TabButton>
          </TabsProvider.Trigger>
          {user?.username === host ? (
            <TabsProvider.Trigger tabIndex={1}>
              <TabButton>
                <div
                  className='flex items-center gap-2'
                  onClick={() => {
                    setHasNewRequests(false);
                  }}>
                  <span>Odottavat</span>
                  {hasNewRequests ? <StatusBadge variant='critical' /> : null}
                </div>
              </TabButton>
            </TabsProvider.Trigger>
          ) : null}
        </div>

        <div className='flex flex-col gap-1 py-2 px-4 w-full'>
          <TabsProvider.Tab tabIndex={0}>
            <List
              data={joined}
              component={({ item }) => (
                <ParticipantListing
                  hostUsername={host}
                  participant={item}
                />
              )}
            />
          </TabsProvider.Tab>
          <TabsProvider.Tab tabIndex={1}>
            <List
              data={pending}
              component={({ item }) => (
                <ParticipantListing
                  hostUsername={host}
                  participant={item}
                />
              )}
            />
          </TabsProvider.Tab>
        </div>
      </TabsProvider>
    </div>
  );
}

const ParticipantListing = ({ participant, hostUsername }) => {
  const { user } = useUserContext();
  const isHost = participant.status === 'host';
  const canAcceptPending = hostUsername === user?.username;

  return (
    <div className='flex gap-2 items-center justify-between w-full bg-background-light border border-gray-600 p-2'>
      <div className='flex items-center gap-2 w-full'>
        <div className='flex gap-1 items-center'>
          {isHost ? (
            <Star
              size='var(--text-sm)'
              fill='var(--accent)'
            />
          ) : (
            <AtSign size='var(--text-sm)' />
          )}
          <span>{participant.username}</span>
        </div>
      </div>
      {participant.status === 'pending' && canAcceptPending ? (
        <div className='flex gap-2 items-center'>
          <button
            className='--no-default text-xs'
            onClick={async () =>
              await rejectJoinRequestAction(participant.event_id, participant.user_id)
            }>
            <X color='var(--color-red-600)' />
          </button>
          <button
            className='--no-default text-xs'
            onClick={async () => {
              await acceptJoinRequestAction(participant.event_id, participant.user_id);
            }}>
            <Check color='var(--color-green-600)' />
          </button>
        </div>
      ) : null}
    </div>
  );
};
