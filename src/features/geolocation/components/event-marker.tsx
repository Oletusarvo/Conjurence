'use client';

import { Modal } from '@/components/modal-temp';
import { useEventContext } from '@/features/events/providers/event-provider';
import { useModalStackContext } from '@/providers/modal-stack-provider';
import { ToggleProvider } from '@/providers/toggle-provider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import { Circle } from 'react-leaflet/Circle';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import { Tooltip } from 'react-leaflet/Tooltip';

/**Renders the leaflet marker used to display events on the map. Must be placed within the scope of an EventContext. */
export function EventMarker() {
  const { setModal } = useModalStackContext();
  const [icon, setIcon] = useState(null);
  const { event } = useEventContext();
  const eventCoordinates = [event.position.coordinates.at(1), event.position.coordinates.at(0)];
  const router = useRouter();

  useEffect(() => {
    import('leaflet').then(L => {
      const blueIcon = new L.Icon({
        iconUrl: '/icons/marker_blue.svg',
        iconSize: [32, 52],
        iconAnchor: [16, 52],
      });
      setIcon(blueIcon);
    });
  }, []);

  return typeof window !== 'undefined' && icon ? (
    <>
      <Marker
        eventHandlers={{
          click: () => router.push(`/app/event/${event.id}`),
        }}
        position={eventCoordinates as any}
        icon={icon}>
        <Tooltip
          direction='bottom'
          offset={[0, 1]}
          opacity={1}
          permanent>
          {event.title}
        </Tooltip>
      </Marker>

      <Circle
        center={eventCoordinates as any}
        pathOptions={{ fillColor: 'blue' }}
        radius={event.position_metadata.accuracy}
      />
    </>
  ) : null;
}
