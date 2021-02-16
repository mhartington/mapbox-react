import { Plugins } from '@capacitor/core';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  useIonViewDidEnter,
} from '@ionic/react';
import { location, navigate } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import ReactMapboxGl, {
  Layer,
  Feature,
  ScaleControl,
  ZoomControl,
  RotationControl,
} from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import './Home.css';

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN as any,
});

const Home: React.FC = () => {
  const locationTrack = useRef<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [state, setState] = useState({
    lng: -71.418884,
    lat: 41.825226,
    zoom: 10,
  });
  useEffect(() => {
    return () => {
      if (locationTrack.current) {
        const { Geolocation } = Plugins;
        Geolocation.clearWatch({ id: locationTrack.current });
      }
    };
  }, []);
  const getLocation = async () => {
    const { Geolocation } = Plugins;
    const loc = await Geolocation.getCurrentPosition();
    setState({
      lng: loc.coords.longitude,
      lat: loc.coords.latitude,
      zoom: 10,
    });
  };
  const trackLocation = () => {
    const { Geolocation } = Plugins;
    locationTrack.current = Geolocation.watchPosition({enableHighAccuracy: true, timeout: 10}, (loc, _err) => {
      setState({
        lng: loc.coords.longitude,
        lat: loc.coords.latitude,
        zoom: 10,
      });
    });
  };

  useIonViewDidEnter(() => {
    setIsLoaded(true);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={getLocation}>
              <IonIcon icon={location} />
            </IonButton>
            <IonButton onClick={trackLocation}>
              <IonIcon icon={navigate} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isLoaded ? (
          <Map
            style="mapbox://styles/mapbox/dark-v9"
            center={[state.lng, state.lat]}
            containerStyle={{
              height: '100%',
              width: '100%',
            }}
          >
            <ScaleControl />
            <ZoomControl />
            <RotationControl style={{ top: 80 }} />

            <Layer
              type="circle"
              paint={{
                'circle-stroke-width': 4,
                'circle-radius': 10,
                'circle-blur': 0.15,
                'circle-color': '#3770C6',
                'circle-stroke-color': 'white',
              }}
            >
              <Feature coordinates={[state.lng, state.lat]} />
            </Layer>
          </Map>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default Home;
