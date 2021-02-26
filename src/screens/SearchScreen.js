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
    marker: { latitude: 37.78825, longitude: -122.4324 },
  };
  const [region, setRegion] = useState(initMapState.region);
  const [marker, setMarker] = useState(initMapState.marker);

  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showUserLocation={true}
        initialRegion={region}
        region={region}
        onPress={(e) => setMarker(e.nativeEvent.coordinate)}
      >
        {/* add callout for marker */}
        <Marker coordinate={marker} title={"San Francisco"} />
        <MapInput setRegion={setRegion} setMarker={setMarker} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: { height: "100%" },
});

export default SearchScreen;
