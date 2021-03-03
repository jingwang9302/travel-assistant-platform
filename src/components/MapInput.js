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
          const photoReference = details.photos[0].photo_reference;
          setRegion({
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
          setMarker({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            title: details.name,
            address: details.formatted_address,
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${config.PLACES_API_KEY}`,
          });
        } else {
          console.log(details);
          setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
          setMarker({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
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
      currentLocationLabel="Current Location"
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
