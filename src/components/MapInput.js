import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { config } from "../../config";
import { Client } from "@googlemaps/google-maps-services-js";

const homePlace = {
  description: "Home",
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
  description: "Work",
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};

const MapInput = ({ setRegion, setMarker }) => {
  const client = new Client({});
  return (
    <GooglePlacesAutocomplete
      placeholder="Enter Location"
      styles={styles}
      minLength={2}
      autoFocus={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true

        if (data.place_id) {
          client
            .placeDetails({
              params: {
                place_id: data.place_id,
                key: config.PLACES_API_KEY,
                fields: ["geometry"],
              },
              timeout: 1000, // milliseconds
            })
            .then((r) => {
              const location = r.data.result.geometry.location;
              setRegion({
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
              setMarker({ latitude: location.lat, longitude: location.lng });
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          console.log(data);
          setRegion({
            latitude: data.geometry.location.lat,
            longitude: data.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setMarker({
            latitude: data.geometry.location.lat,
            longitude: data.geometry.location.lng,
          });
        }
      }}
      query={{
        key: config.PLACES_API_KEY,
        language: "en",
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={200}
      predefinedPlaces={[homePlace, workPlace]}
      currentLocation={true}
      currentLocationLabel="Current location"
    />
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    backgroundColor: "grey",
  },
  textInput: {
    height: 38,
    color: "#5d5d5d",
    fontSize: 16,
  },
  predefinedPlacesDescription: {
    color: "#1faadb",
  },
});

export default MapInput;
