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
  TouchableHighlight,
  Button,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import * as Permissions from "expo-permissions";
import { withNavigation } from "react-navigation";
import MapInput from "../components/MapInput";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const SearchScreen = ({ navigation }) => {
  console.log(navigation);
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

  const getCurrentLocation = async () => {
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
    getCurrentLocation();
  }, []);

  const handleClick = () => {
    console.log("Click");
  };

  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={region}
        region={region}
        onPress={(e) => {
          if (e.nativeEvent.action) return;
          setMarker(e.nativeEvent.coordinate);
        }}
        // BUG: shuttered, onRegionChangeComplete will causing a continues scrolling
        // onRegionChange={onRegionChange}
      >
        <MapView.Marker coordinate={marker} title={marker.title}>
          <MapView.Callout
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
          </MapView.Callout>
        </MapView.Marker>
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
