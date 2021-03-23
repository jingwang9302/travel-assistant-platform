import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import Polyline from "@mapbox/polyline";
import MapInput from "../../components/MapInput";
import ResultList from "./ResultsList";

import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { Button } from "react-native-elements";
import { config } from "../../../config";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const SearchScreen = ({ navigation }) => {
  let [region, setRegion] = useState(null);
  const [marker, setMarker] = useState([]);
  const [navigationInfo, setNavigationInfo] = useState(null);
  const { currentLocation, loading, error } = useCurrentLocation();
  if (!currentLocation) {
    return (
      <View>
        <Text>Loading location...</Text>
      </View>
    );
  }

  const initRegion = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const getDirections = async (startLoc, desLoc) => {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=${config.DIRECTION_API_KEY}`
      );
      const respJson = await resp.json();
      const response = respJson.routes[0];
      const distanceTime = response.legs[0];
      const distance = distanceTime.distance.text;
      const time = distanceTime.duration.text;
      const points = Polyline.decode(
        respJson.routes[0].overview_polyline.points
      );
      const coords = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      setNavigationInfo({ coords, distance, time });
      console.log("================================");
      console.log(distance);
      console.log(time);
      // console.log(response);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const mergeCoods = () => {
    console.log("Navigation info");
    console.log(navigationInfo);
    if (navigationInfo) {
      const { desLatitude, desLongitude } = navigationInfo;
      const hasStartAndEnd =
        currentLocation.latitude !== null && desLatitude !== null;
      if (hasStartAndEnd) {
        const concatStart = `${currentLocation.latitude},${currentLocation.longitude}`;
        const concatEnd = `${desLatitude},${desLongitude}`;
        console.log(concatStart);
        getDirections(concatStart, concatEnd);
      }
    }
  };
  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={initRegion}
        region={region || initRegion}
        onPress={(e) => {
          if (e.nativeEvent.action) return;
          setMarker([e.nativeEvent.coordinate]);
        }}
      >
        {navigationInfo &&
          navigationInfo.coords &&
          navigationInfo.coords.length > 0 && (
            <MapView.Polyline
              strokeWidth={2}
              strokeColor="red"
              coordinates={navigationInfo.coords}
            />
          )}
        {marker.length > 0 &&
          marker.map((item) => (
            <Marker
              coordinate={item}
              title={item.title}
              key={item.place_id}
              onPress={() => {
                setNavigationInfo({
                  desLatitude: item.latitude,
                  desLongitude: item.longitude,
                });
                console.log("On press");
                mergeCoods();
              }}
            >
              <Callout
                onPress={() => {
                  navigation.navigate("Result", { result: item });
                }}
                tooltip
              >
                <View style={styles.bubble}>
                  <Text>{item.title}</Text>
                  <Text>{item.address}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        {/* {typeof item.url === "string" && (
          <Image
            source={{
              uri: item.url,
            }}
            style={{
              flex: 1,
              width: width * 0.95,
              alignSelf: "center",
              height: height * 0.15,
              position: "absolute",
              bottom: height * 0.05,
            }}
          />
        )} */}
      </MapView>
      <View style={styles.mapInput}>
        <MapInput
          setRegion={setRegion}
          setMarker={setMarker}
          currentLocation={currentLocation}
        />
      </View>
      {/* <View>
        <ResultList />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mapInput: { position: "absolute", width: width },
  map: { height: "100%" },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgb(255,255,255)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
});

export default SearchScreen;
