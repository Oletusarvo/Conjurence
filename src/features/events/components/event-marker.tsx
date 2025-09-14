'use client';

import { useEventContext } from '@/features/events/providers/event-provider';

import { useEffect, useState } from 'react';
import { Circle } from 'react-leaflet/Circle';
import { Marker } from 'react-leaflet/Marker';
import { Tooltip } from 'react-leaflet/Tooltip';
import { useMapIcon } from '../../geolocation/hooks/use-map-icon';
import { useEventPositionContext } from '../providers/event-position-provider';
import { useEventIcon } from '@/features/geolocation/hooks/use-event-icon';

/**Renders the leaflet marker used to display events on the map. Must be placed within the scope of an EventContext. */
export function EventMarker({ onClick = null }) {
  const { event } = useEventContext();
  const { position, positionIsStale } = useEventPositionContext();

  //const icon = useMapIcon(positionIsStale ? '/icons/marker_gray.svg' : '/icons/marker_blue.svg');
  const icon = useEventIcon(positionIsStale);
  const eventCoordinates = position && [position.coordinates.at(1), position.coordinates.at(0)];

  const circleColor = positionIsStale ? 'gray' : 'blue';
  return typeof window !== 'undefined' && position && icon ? (
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
          {event?.title || 'No title'}
        </Tooltip>
      </Marker>

      <Circle
        center={eventCoordinates as any}
        pathOptions={{ fillColor: circleColor, color: circleColor, opacity: 0.2, fillOpacity: 0.1 }}
        radius={position.accuracy}
      />
    </>
  ) : null;
}
