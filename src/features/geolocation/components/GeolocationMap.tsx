'use client';

import { useEffect, useRef, useState } from 'react';
import { useGeolocationContext } from '../providers/GeolocationProvider';
import toast from 'react-hot-toast';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import { useEventContext } from '@/features/events/providers/EventProvider';
import { Circle } from 'react-leaflet';

export function GeolocationMap() {
  const { position } = useGeolocationContext();
  const { event } = useEventContext();
  const [icons, setIcons] = useState(null);

  const eventCoordinates = [event.position.coordinates.at(1), event.position.coordinates.at(0)];
  const positionCoordinates = [position?.coords.latitude, position?.coords.longitude];

  useEffect(() => {
    // Lazy load Leaflet
    import('leaflet').then(L => {
      const redIcon = new L.Icon({
        iconUrl: '/icons/marker_red.svg',
        iconSize: [32, 52],
        iconAnchor: [16, 52],
      });

      const blueIcon = new L.Icon({
        iconUrl: '/icons/marker_blue.svg',
        iconSize: [32, 52],
        iconAnchor: [16, 52],
      });

      setIcons({ red: redIcon, blue: blueIcon });
    });
  }, []);

  return typeof window === 'undefined' ? null : (
    <MapContainer
      style={{ height: '100%', zIndex: 10 }}
      center={eventCoordinates as any}
      zoom={13}
      scrollWheelZoom={false}>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

      {icons ? (
        <>
          <Marker
            position={eventCoordinates as any}
            icon={icons.blue}>
            <Popup>The event is estimated to be here.</Popup>
          </Marker>
          <Circle
            center={eventCoordinates as any}
            pathOptions={{ fillColor: 'blue' }}
            radius={event.position_metadata.accuracy}
          />
        </>
      ) : null}

      {position && icons ? (
        <>
          <Marker
            position={positionCoordinates as any}
            icon={icons.red}>
            <Popup>You are here.</Popup>
          </Marker>
          <Circle
            center={positionCoordinates as any}
            pathOptions={{ fillColor: 'red', color: 'red' }}
            radius={position?.coords.accuracy || 0}
          />
        </>
      ) : null}
    </MapContainer>
  );
}
