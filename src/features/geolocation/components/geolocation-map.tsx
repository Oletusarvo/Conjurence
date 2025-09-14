'use client';

import { useGeolocationContext } from '../providers/geolocation-provider';
import { MapContainer, MapContainerProps } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { UserMarker } from './user-marker';
import { useMapEvent } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { useRef } from 'react';

type GeolocationMapProps = React.PropsWithChildren &
  MapContainerProps & {
    onSelectLocation?: (coords: LatLng) => void;
  };

/**Renders a leaflet-map centered on the users current location. */
export function GeolocationMap({
  children,
  onSelectLocation,
  center,
  ...props
}: GeolocationMapProps) {
  const { position } = useGeolocationContext();

  //Set once.
  const mapCenter =
    center || position
      ? { lat: position?.coords.latitude, lng: position?.coords.longitude }
      : undefined;

  return typeof window === 'undefined' || !position ? null : (
    <MapContainer
      {...props}
      center={mapCenter}
      style={{ height: '100%', zIndex: 10 }}
      //center={positionCoordinates as any}
      zoom={15}
      scrollWheelZoom={false}>
      <MapClickManager handler={onSelectLocation} />
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <UserMarker />
      {children}
    </MapContainer>
  );
}

function MapClickManager({ handler }: { handler?: (coords: LatLng) => void }) {
  useMapEvent('click', e => {
    if (handler) {
      handler(e.latlng);
    }
  });
  return null;
}
