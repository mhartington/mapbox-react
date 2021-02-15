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
} from '@ionic/react';
import { location, navigate } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { Map } from '../components/Map';
import './Home.css';

const Home: React.FC = () => {
  const locationTrack = useRef<string>('');
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
    locationTrack.current = Geolocation.watchPosition({}, (loc, _err) => {
      setState({
        lng: loc.coords.longitude,
        lat: loc.coords.latitude,
        zoom: 10,
      });
    });
  };
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
        <Map {...state} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
