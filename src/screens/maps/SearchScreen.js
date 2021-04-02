import React, { useState, useEffect } from "react";
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
import * as Permissions from "expo-permissions";
import MapInput from "../../components/MapInput";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const SearchScreen = ({ navigation }) => {
  // replace the initial to user's current location
  const initMapState = {
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    marker: {
      latitude: 37.78825,
      longitude: -122.4324,
      title: "title",
      address: "Address",
      url: null,
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

  const getLocation = async () => {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      const response = await Permissions.askAsync(Permissions.LOCATION);
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        setRegion({
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }),
      (error) => {
        console.log("Error:", error);
      }
    );
    return () => {
      console.log("Location granted");
    };
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={region}
        region={region}
        onPress={(e) => {
          setMarker(e.nativeEvent.coordinate);
        }}
        // onRegionChange={onRegionChange}
      >
        <Marker
          coordinate={marker}
          title={marker.title}
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
          <Callout tooltip>
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
    backgroundColor: "rgb(255,255,255)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
});

export default SearchScreen;
