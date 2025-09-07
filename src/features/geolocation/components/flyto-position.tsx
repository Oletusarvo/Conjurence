'use client';

import { TEvent } from '@/features/events/schemas/event-schema';
import { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

type FlyToPositionProps = {
  position: LatLngExpression;
};

export function FlyToPosition({ position }: FlyToPositionProps) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position);
  }, [position]);
  return null;
}
