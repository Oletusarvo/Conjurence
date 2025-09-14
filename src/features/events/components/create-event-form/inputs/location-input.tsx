import { GeolocationMap } from '@/features/geolocation/components/geolocation-map';
import { useCreateEventFormContext } from '../create-event-form';
import { cloneFormData } from '@/util/clone-form-data';
import { useMapIcon } from '@/features/geolocation/hooks/use-map-icon';
import { Marker, Tooltip } from 'react-leaflet';
import { LatLng } from 'leaflet';
import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { useState } from 'react';
import { createIcon } from '@/features/geolocation/util/createIcon';

export function LocationInput() {
  const icon = createIcon('/icons/marker_blue.svg');
  const [position, setPosition] = useState(null);
  const currentCoords = position ? JSON.parse(position).coordinates : null;
  const markerPos = { lat: currentCoords.at(1), lng: currentCoords.at(0) };
  console.log('Marker pos: ', markerPos);

  return (
    typeof window !== 'undefined' && (
      <GeolocationMap
        onSelectLocation={coords => {
          setPosition(coords);
        }}>
        {icon && currentCoords && (
          <Marker
            position={markerPos}
            icon={icon}></Marker>
        )}
      </GeolocationMap>
    )
  );
}
