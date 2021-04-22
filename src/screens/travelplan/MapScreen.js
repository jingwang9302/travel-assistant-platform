import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Dimensions,
} from "react-native";

import { Button } from "react-native-elements";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";
import MapInput from "../../components/MapInput";
import axios from "axios";
import { config } from "../../../config";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";

const MapScreen = ({ navigation, route }) => {
  const { initialLocation, readOnly, title } = route.params;
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  //const [place, setPlace] = useState(null);
  const [placeDetail, setPlaceDetail] = useState(null);
  const { height, width } = Dimensions.get("window");

  const mapRef = useRef(null);
  const mapDetailRef = useRef(null);

  // console.log("initiallocation is:");
  // console.log(initialLocation);

  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.2329,
    longitude: initialLocation ? initialLocation.lng : -122.406417,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // console.log("mapRegi0n is:");
  // console.log(mapRegion);

  React.useLayoutEffect(() => {
    if (!readOnly) {
      navigation.setOptions({
        headerRight: () => (
          <HeaderButtons>
            <Item
              style={{ marginRight: 15, justifyContent: "center" }}
              title="Add"
              onPress={() => {
                fetchLocationInfo();
              }}
            />
          </HeaderButtons>
        ),
      });
    }
  }, [selectedLocation]);

  const fetchLocationInfo = () => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.lat},${selectedLocation.lng}&key=${config.API_KEY_FOR_PLACES}`
      )
      .then((res) => {
        //console.log("res: \n" + JSON.stringify(res));
        const result = res.data.results[0];
        console.log("result: \n");
        console.log(result);

        const address = result.formatted_address;
        const placeId = result.place_id;
        const { lat } = result.geometry.location;
        const { lng } = result.geometry.location;
        const place = { placeId, address, lat, lng };
        // console.log("place is: ");
        // console.log(`${place.address}`);

        navigation.navigate("PlacePick", {
          placeInfo: place,
          pickedLocationFromMap: { lat, lng },
        });
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Failed!", "feching google place has problem");
      });
  };

  const onAutoCompleteHandler = (place_detail) => {
    setSelectedLocation({
      lat: place_detail.geometry.location.lat,
      lng: place_detail.geometry.location.lng,
    });
  };
  const showMyLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let myLocation = await Location.getCurrentPositionAsync({ accuracy: 6 });
    // console.log(myLocation);

    if (myLocation !== null) {
      mapRef.current.animateCamera({
        center: {
          latitude: myLocation.coords.latitude,
          longitude: myLocation.coords.longitude,
        },
      });
      setSelectedLocation({
        lat: myLocation.coords.latitude,
        lng: myLocation.coords.longitude,
      });
    }
  };

  const selectLocationHandler = (event) => {
    if (readOnly) {
      return;
    }

    // console.log("picked location");
    // console.log(event.nativeEvent.coordinate.latitude);
    // console.log(event.nativeEvent.coordinate.longitude);

    if (placeDetail) {
      // console.log("atuo location");
      // console.log(placeDetail.geometry.location.lat);
      // console.log(placeDetail.geometry.location.lng);

      if (
        event.nativeEvent.coordinate.latitude ===
          placeDetail.geometry.location.lat &&
        event.nativeEvent.coordinate.longitude ===
          placeDetail.geometry.location.lng
      ) {
        return;
      }
    }
    setPlaceDetail(null);
    // console.log("setplace detail is clicked");
    // console.log(placeDetail);

    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ height: "100%" }}
        initialRegion={mapRegion}
        zoomEnabled={true}
        onPress={selectLocationHandler}
      >
        {markerCoordinates && (
          <Marker coordinate={markerCoordinates}>
            <Callout>
              {placeDetail ? (
                <View
                  style={{
                    flex: 1,
                    length: 80,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 5,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {placeDetail.name}
                  </Text>
                  <Text style={{ fontSize: 13 }}>
                    {placeDetail.formatted_address}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    length: 80,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 5,
                  }}
                >
                  {title ? (
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      {title}
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      Picked Location
                    </Text>
                  )}
                </View>
              )}
            </Callout>
          </Marker>
        )}
      </MapView>
      <View style={{ position: "absolute", width: width }}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          autoFocus={true}
          onPress={(data, details) => {
            setPlaceDetail(details);
            onAutoCompleteHandler(details);

            mapRef.current.animateCamera({
              center: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              },
            });
          }}
          query={{
            key: config.PLACES_API_KEY,
            language: "en",
          }}
          styles={{
            container: {
              flex: 1,
            },
            textInputContainer: {
              flexDirection: "row",
            },
            textInput: {
              backgroundColor: "#FFFFFF",
              height: 40,
              borderRadius: 5,
              paddingVertical: 0,
              paddingHorizontal: 5,
              fontSize: 15,
              flex: 1,
            },
          }}
        />
      </View>

      <View style={styles.FloatingButton}>
        <Button title="My Location" onPress={showMyLocation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  headerButton: {
    marginHorizontal: 20,
  },
  FloatingButton: {
    position: "absolute",

    height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 150,
    bottom: 2,
  },
});

export default MapScreen;
