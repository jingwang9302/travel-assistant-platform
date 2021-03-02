import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { config } from "../../config";
import { Client } from "@googlemaps/google-maps-services-js";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

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
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true

        if (details.place_id) {
          const location = details.geometry.location;
          setRegion({
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setMarker({
            position: {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            },
            title: data.structured_formatting.main_text,
            address: data.structured_formatting.secondary_text,
          });
        } else {
          console.log(details);
          setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setMarker({
            position: {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            },
            title: details.description,
            address: `Address: (${details.geometry.location.lat}, ${details.geometry.location.lng})`,
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
