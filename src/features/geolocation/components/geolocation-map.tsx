'use client';

import { useGeolocationContext } from '../providers/geolocation-provider';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { EventMarker } from './event-marker';
import { UserMarker } from './user-marker';
import { useDeferredValue } from 'react';

/**Renders a leaflet-map centered on the users current location. */
export function GeolocationMap({ children }: React.PropsWithChildren) {
  const { position } = useGeolocationContext();
  const positionCoordinates = [position?.coords.latitude, position?.coords.longitude];

  return typeof window === 'undefined' || !position ? null : (
    <MapContainer
      style={{ height: '100%', zIndex: 10 }}
      center={positionCoordinates as any}
      zoom={15}
      scrollWheelZoom={false}>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <UserMarker />
      {children}
    </MapContainer>
  );
}
