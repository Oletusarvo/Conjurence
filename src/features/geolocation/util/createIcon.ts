import L from 'leaflet';

export function createIcon(iconUrl: string) {
  return new L.Icon({
    iconUrl,
    shadowUrl: '/icons/marker-shadow.png',
    iconSize: [32, 52],
    iconAnchor: [16, 52],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
}
