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
import { withNavigation } from "react-navigation";
import MapInput from "../components/MapInput";
import { useCurrentLocation } from "../hooks/useCurrentLocation";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const SearchScreen = ({ navigation }) => {
  let [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const { currentLocation, loading, error } = useCurrentLocation();
  if (!currentLocation || loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View>
        <Text>Error loading data</Text>
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
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={initRegion}
        region={region || initRegion}
        onPress={(e) => {
          if (e.nativeEvent.action) return;
          setMarker(e.nativeEvent.coordinate);
        }}
      >
        {marker && (
          <Marker coordinate={marker} title={marker.title}>
            <Callout
              onPress={() => {
                navigation.navigate("Result");
              }}
              tooltip
            >
              <View style={styles.bubble}>
                <Text>{marker.title}</Text>
                {typeof marker.url === "string" && (
                  <Image
                    source={{
                      uri: marker.url,
                    }}
                    style={{ height: 100, width: 200 }}
                  />
                )}
              </View>
            </Callout>
          </Marker>
        )}
        <MapInput
          setRegion={setRegion}
          setMarker={setMarker}
          currentLocation={currentLocation}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
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
