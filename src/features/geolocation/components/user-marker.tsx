'use client';

import { useEffect, useState } from 'react';
import { useGeolocationContext } from '../providers/geolocation-provider';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import { Circle } from 'react-leaflet/Circle';
import { useMapIcon } from '../hooks/use-map-icon';
import { Tooltip } from 'react-leaflet';

/**Renders the leaflet marker of the currently logged in user. */
export function UserMarker() {
  const icon = useMapIcon('/icons/marker_red.svg');
  const { position } = useGeolocationContext();
  const positionCoordinates = [position?.coords.latitude, position?.coords.longitude];

  return typeof window !== 'undefined' && position && icon ? (
    <>
      <Marker
        position={positionCoordinates as any}
        icon={icon}>
        <Tooltip
          permanent
          direction={'bottom'}
          offset={[0, 1]}>
          You are here.
        </Tooltip>
      </Marker>
      <Circle
        center={positionCoordinates as any}
        pathOptions={{ fillColor: 'red', color: 'red' }}
        radius={position?.coords.accuracy || 0}
      />
    </>
  ) : null;
}
