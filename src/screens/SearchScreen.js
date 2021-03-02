import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import MapInput from "../components/MapInput";

const SearchScreen = () => {
  // replace the initial to user's current location
  const initMapState = {
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    marker: {
      position: { latitude: 37.78825, longitude: -122.4324 },
      title: "title",
      address: "Address",
    },
  };
  const [region, setRegion] = useState(initMapState.region);
  const [marker, setMarker] = useState(initMapState.marker);

  const onRegionChange = (reg) => {
    setRegion(reg);
    console.log("On Region Change");
  };

  const show = () => {
    marker.showCallout();
  };
  const hide = () => {
    marker.hideCallout();
  };

  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showUserLocation={true}
        initialRegion={region}
        region={region}
        onPress={(e) => setMarker({ position: e.nativeEvent.coordinate })}
        onRegionChange={onRegionChange}
      >
        <Marker coordinate={marker.position}>
          <Callout
            onPress={(e) => {
              if (
                e.nativeEvent.action === "marker-inside-overlay-press" ||
                e.nativeEvent.action === "callout-inside-press"
              ) {
                return;
              }

              console.log("On Press callout");
            }}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  console.log("Show");
                  marker.showCallout();
                }}
                style={[styles.bubble, styles.button]}
              >
                <Text>Show</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={{ hide }}
                style={[styles.bubble, styles.button]}
              >
                <Text>Hide</Text>
              </TouchableOpacity>
            </View>
          </Callout>
        </Marker>

        <MapInput setRegion={setRegion} setMarker={setMarker} />
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
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
});

export default SearchScreen;
