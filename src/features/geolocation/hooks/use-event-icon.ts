import { useEffect, useRef } from 'react';

export function useEventIcon(isPositionStale: boolean) {
  const icons = useRef({
    stale: null,
    active: null,
  });

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
  }, []);

  return isPositionStale ? icons.current.stale : icons.current.active;
}
