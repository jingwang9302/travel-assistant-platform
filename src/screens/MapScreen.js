import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import MapView from "react-native-maps";
import SearchBar from "../components/SearchBar";

const MapScreen = () => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  );
};

const styles = StyleSheet.create({
  map: {
    height: 800,
  },
});

export default MapScreen;
