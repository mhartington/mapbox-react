import { useEffect, useRef } from 'react';
import { Map as MGLMap, Marker, NavigationControl } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useIonViewDidEnter } from '@ionic/react';

type MapProps = {
  lng: number;
  lat: number;
  zoom: number;
};

export function Map({ lng, lat, zoom }: MapProps) {
  const mapContainerRef = useRef(null);
  const mapInst = useRef<mapboxgl.Map>();
  const mapMarker = useRef<mapboxgl.Marker>();

  useEffect(() => {
    mapInst.current = new MGLMap({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });
    mapInst.current.addControl(new NavigationControl(), 'top-right');

    mapMarker.current = new Marker()
      .setLngLat([lng, lat])
      .addTo(mapInst.current);
  }, []);

  useIonViewDidEnter(() => {
    mapInst.current?.resize();
    mapInst.current?.setCenter([lng, lat])
  });

  useEffect(() => {
    mapInst.current?.panTo([lng, lat]);
    mapMarker.current?.setLngLat([lng, lat])
  }, [lng, lat, zoom]);

  return (
    <div
      className="map-container"
      style={{ width: '100%', height: '100%' }}
      ref={mapContainerRef}
    />
  );
}
