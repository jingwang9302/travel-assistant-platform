import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import MapInput from "../components/MapInput";

const SearchScreen = () => {
  const initState = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  // replace the initial to user's current location
  const [region, setRegion] = useState("");

  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showUserLocation={true}
        initialRegion={initState}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title={"San Francisco"}
        />
        <MapInput />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: { height: "100%" },
});

export default SearchScreen;
