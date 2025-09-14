import { useEffect, useRef } from 'react';
import { createIcon } from '../util/createIcon';

export function useEventIcon(positionIsStale: boolean) {
  const icons = useRef({
    stale: createIcon('/icons/marker_gray.svg'),
    active: createIcon('/icons/marker_blue.svg'),
  });

  /*
  useEffect(() => {
    import('leaflet').then(L => {
      const activeIcon = new L.Icon({
        iconUrl: '/icons/marker_blue.svg',
        shadowUrl: '/icons/marker-shadow.png',
        iconSize: [32, 52],
        iconAnchor: [16, 52],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
      });

      const staleIcon = new L.Icon({
        iconUrl: '/icons/marker_gray.svg',
        shadowUrl: '/icons/marker-shadow.png',
        iconSize: [32, 52],
        iconAnchor: [16, 52],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
      });

      icons.current = {
        stale: staleIcon,
        active: activeIcon,
      };
    });
  }, []);*/

  return positionIsStale ? icons.current.stale : icons.current.active;
}
