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
  const [navigationRegion, setNavigationRegion] = useState(null);

  const [coords, setCoords] = useState([]);

  const { currentLocation, loading, error } = useCurrentLocation();
  if (!currentLocation) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const initRegion = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const navigatedRegion = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    desLatitude: marker.latitude,
    desLongitude: marker.longitude,
  };

  const getDirections = async (startLoc, desLoc) => {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=${config.DIRECTION_API_KEY}`
      );
      console.log(resp);
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
      setCoords(coords);
      // setNavigationRegion({ coords, distance, time });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const mergeCoods = () => {
    const { latitude, longitude, desLatitude, desLongitude } = navigationRegion;
    const hasStartAndEnd = latitude !== null && desLatitude !== null;
    if (hasStartAndEnd) {
      const concatStart = `${latitude},${longitude}`;
      const concatEnd = `${desLatitude},${desLongitude}`;
      getDirections(concatStart, concatEnd);
    }
  };
  console.log(coords);
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
        {coords.length > 0 && (
          <MapView.Polyline
            strokeWidth={2}
            strokeColor="red"
            coordinates={coords}
          />
        )}
        {marker.length > 0 &&
          marker.map((item) => (
            <Marker coordinate={item} title={item.title} key={item.place_id}>
              <Callout
                onPress={() => {
                  // navigation.navigate("Result", { result: item });
                  const startLoc = `${currentLocation.latitude},${currentLocation.longitude}`;
                  const desLoc = "37.90233116205613,-121.93255815277293";
                  getDirections(startLoc, desLoc);
                }}
                tooltip
              >
                <View style={styles.bubble}>
                  <Text>{item.title}</Text>
                  {typeof item.url === "string" && (
                    <Image
                      source={{
                        uri: item.url,
                      }}
                      style={{ height: 100, width: 200 }}
                    />
                  )}
                </View>
              </Callout>
            </Marker>
          ))}
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
