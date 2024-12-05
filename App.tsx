import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import MapView, { Marker } from 'react-native-maps';

// Define the type for location
interface Location {
  latitude: number;
  longitude: number;
}

export default function App() {
  const [location, setLocation] = useState<Location | null>(null); // Explicitly define the type
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Request permissions and get the location
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (response === RESULTS.GRANTED) {
          getLocation();
        } else {
          setErrorMsg('Location permission is not granted');
        }
      } else {
        Geolocation.requestAuthorization('whenInUse')
          .then(status => {
            if (status === 'granted') {
              getLocation();
            } else {
              setErrorMsg('Location permission is not granted');
            }
          })
          .catch(error => setErrorMsg('Failed to request location permission'));
      }
    };

    // Get the current location
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
        },
        (error) => {
          setErrorMsg(error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    // Request permission and get location
    requestLocationPermission();
  }, []);

  if (errorMsg) {
    return (
      <View>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {location ? (
        <>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={location} />
          </MapView>
          <Text>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Text>
        </>
      ) : (
        <Text>Waiting for location...</Text>
      )}
    </View>
  );
}
