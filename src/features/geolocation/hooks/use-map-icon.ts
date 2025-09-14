import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

export function useMapIcon(iconUrl: string) {
  const icon = useRef(
    new L.Icon({
      iconUrl,
      shadowUrl: '/icons/marker-shadow.png',
      iconSize: [32, 52],
      iconAnchor: [16, 52],
      shadowSize: [41, 41],
      shadowAnchor: [12, 41],
    })
  );

  return icon;
}
