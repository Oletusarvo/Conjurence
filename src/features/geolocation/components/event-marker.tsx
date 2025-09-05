'use client';

import { EventModal } from '@/features/events/components/ui/event-modal';
import { useEventContext } from '@/features/events/providers/event-provider';
import { useModalStackContext } from '@/providers/modal-stack-provider';

import { useEffect, useState } from 'react';
import { Circle } from 'react-leaflet/Circle';
import { Marker } from 'react-leaflet/Marker';
import { Tooltip } from 'react-leaflet/Tooltip';

/**Renders the leaflet marker used to display events on the map. Must be placed within the scope of an EventContext. */
export function EventMarker({ onClick = null }) {
  const [icon, setIcon] = useState(null);
  const { event } = useEventContext();
  const eventCoordinates = [event.position.coordinates.at(1), event.position.coordinates.at(0)];

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
          click: onClick,
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
        radius={event.position.accuracy}
      />
    </>
  ) : null;
}
