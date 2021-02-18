import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";

const MyMapView = (props) => {
  return (
    <MapView
      style={styles.map}
      region={props.region}
      showUserLocation={true}
      provider={PROVIDER_GOOGLE}
      onRegionChange={(reg) => {
        return props.onRegionChange(reg);
      }}
    >
      <Marker coordinate={props.region} />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: { height: "100%" },
});

export default MyMapView;
