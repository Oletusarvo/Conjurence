'use client';

import { useEffect, useState } from 'react';
import { useGeolocationContext } from '../providers/geolocation-provider';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import { Circle } from 'react-leaflet/Circle';

/**Renders the leaflet marker of the currently logged in user. */
export function UserMarker() {
  const [icon, setIcon] = useState(null);
  const { position } = useGeolocationContext();
  const positionCoordinates = [position?.coords.latitude, position?.coords.longitude];

  useEffect(() => {
    import('leaflet').then(L => {
      const redIcon = new L.Icon({
        iconUrl: '/icons/marker_red.svg',
        iconSize: [32, 52],
        iconAnchor: [16, 52],
      });
      setIcon(redIcon);
    });
  }, []);

  return typeof window !== 'undefined' && position && icon ? (
    <>
      <Marker
        position={positionCoordinates as any}
        icon={icon}>
        <Popup>You are here.</Popup>
      </Marker>
      <Circle
        center={positionCoordinates as any}
        pathOptions={{ fillColor: 'red', color: 'red' }}
        radius={position?.coords.accuracy || 0}
      />
    </>
  ) : null;
}
