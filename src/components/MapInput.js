import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Dimensions } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { config } from "../../config";
import useResults from "../hooks/useResults";
import ResultsList from "../screens/maps/ResultsList";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const MapInput = ({ setRegion, setMarker, currentLocation }) => {
  const [text, setText] = useState("");
  const [getSearchResultApi, searchResult, errorMessage] = useResults(
    currentLocation
  );

  const results =
    searchResult && searchResult.resultList && searchResult.resultList.results;

  useEffect(() => {
    if (!results) return;
    setMarker(
      results.map((item) => {
        const photoReference = item.photos && item.photos[0].photo_reference;

        return {
          place_id: item.place_id,
          url: photoReference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${config.PLACES_API_KEY}`
            : "placeholder",
          latitude: item.geometry.location.lat,
          longitude: item.geometry.location.lng,
          title: item.name,
          address: item.vicinity,
        };
      })
    );
  }, [results]);

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
          const photoReference =
            details.photos && details.photos[0].photo_reference;
          // console.log(details.name);
          setRegion({
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
          setMarker([
            {
              place_id: details.place_id,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              title: details.name,
              address: details.formatted_address,
              url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${config.PLACES_API_KEY}`,
            },
          ]);
        } else {
          // console.log(details);
          setRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
          setMarker([
            {
              place_id: details.place_id,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              title: details.description,
              address: `Address: (${details.geometry.location.lat}, ${details.geometry.location.lng})`,
            },
          ]);
        }
      }}
      textInputProps={{
        clearButtonMode: "always",
        InputComp: TextInput,
        onChangeText: (text) => {
          setText(text);
        },
        onSubmitEditing: () => {
          getSearchResultApi(text);
        },
      }}
      query={{
        key: config.PLACES_API_KEY,
        language: "en",
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={500}
      currentLocation={true}
    ></GooglePlacesAutocomplete>
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
