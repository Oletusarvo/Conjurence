import { GeolocationMap } from '@/features/geolocation/components/geolocation-map';
import { useCreateEventFormContext } from '../create-event-form';
import { cloneFormData } from '@/util/clone-form-data';
import { useMapIcon } from '@/features/geolocation/hooks/use-map-icon';
import { Marker, Tooltip } from 'react-leaflet';
import { LatLng } from 'leaflet';

export function LocationInput() {
  const { payload, setPayload } = useCreateEventFormContext();
  const icon = useMapIcon('/icons/marker_blue.svg');
  const position = payload.get('position')?.toString();

  const currentCoords = position ? JSON.parse(position).coordinates : null;
  const markerPos = { lat: currentCoords.at(1), lng: currentCoords.at(0) };
  console.log('Marker pos: ', markerPos);

  return (
    typeof window !== 'undefined' && (
      <GeolocationMap
        onSelectLocation={coords => {
          const fd = cloneFormData(payload);
          fd.set(
            'position',
            JSON.stringify({
              coordinates: [coords.lng, coords.lat],
              accuracy: 0,
              timestamp: Date.now(),
            })
          );
          setPayload(fd);
        }}>
        {icon && currentCoords && (
          <Marker
            position={markerPos}
            icon={icon}>
            <Tooltip
              direction='bottom'
              offset={[0, 1]}
              permanent
              opacity={1}>
              {payload.get('title')?.toString()}
            </Tooltip>
          </Marker>
        )}
      </GeolocationMap>
    )
  );
}
