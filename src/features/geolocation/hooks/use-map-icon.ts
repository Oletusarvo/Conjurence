import { useEffect, useState } from 'react';

export function useMapIcon(iconUrl: string) {
  const [icon, setIcon] = useState(null);
  useEffect(() => {
    import('leaflet').then(L => {
      const redIcon = new L.Icon({
        iconUrl,
        iconSize: [32, 52],
        iconAnchor: [16, 52],
      });
      setIcon(redIcon);
    });
  }, []);

  return icon;
}
