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
import MapInput from "../components/MapInput";
import { useCurrentLocation } from "../hooks/useCurrentLocation";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const SearchScreen = ({ navigation }) => {
  let [region, setRegion] = useState(null);
  const [marker, setMarker] = useState([]);
  const { currentLocation, loading, error } = useCurrentLocation();
  if (!currentLocation)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  const initRegion = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  return (
    <View>
      <View style={styles.mapInput}>
        <MapInput
          setRegion={setRegion}
          setMarker={setMarker}
          currentLocation={currentLocation}
          //       "accuracy": 10,
          //       "altitude": 6.025020599365234,
          //       "altitudeAccuracy": 16,
          //       "heading": 0,
          //       "latitude": 37.40235756154861,
          //       "longitude": -121.93245923157961,
          //       "speed": 1.149999976158142,
        />
      </View>
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
        {marker.length > 0 &&
          marker.map((item) => (
            <Marker coordinate={item} title={item.title} key={item.place_id}>
              <Callout
                onPress={() => {
                  navigation.navigate("Result", { result: item });
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
    </View>
  );
};

const styles = StyleSheet.create({
  mapInput: { height: 43 },
  map: { height: "94%" },

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
