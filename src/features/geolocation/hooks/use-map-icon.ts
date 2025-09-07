import { useEffect, useState } from 'react';

export function useMapIcon(iconUrl: string) {
  const [icon, setIcon] = useState(null);
  useEffect(() => {
    import('leaflet').then(L => {
      const redIcon = new L.Icon({
        iconUrl,
        shadowUrl: '/icons/marker-shadow.png',
        iconSize: [32, 52],
        iconAnchor: [16, 52],
        shadowSize: [41, 41],
        shadowAnchor: [12, 41],
      });
      setIcon(redIcon);
    });
  }, [iconUrl]);

  return icon;
}
