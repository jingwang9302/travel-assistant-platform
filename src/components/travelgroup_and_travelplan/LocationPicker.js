import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import * as Location from "expo-location";
//import * as Permissions from "expo-permissions";

//import Colors from "../constants/Colors";
import MapPreview from "./MapPreview";

const LocationPicker = (props) => {
  const [isFetching, setIsFetching] = useState(false);
  const [pickedLocation, setPickedLocation] = useState();

  //const mapPickedLocation = props.navigation.getParam("pickedLocation");

  const { mapPickedLocation, navigation } = props;

  useEffect(() => {
    if (mapPickedLocation) {
      setIsFetching(true);
      setPickedLocation(mapPickedLocation);
      setIsFetching(false);
      //onLocationPicked(mapPickedLocation);
    }
  }, [mapPickedLocation]);

  const verifyPermissions = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Warning", "Permission to access location was denited");
      return false;
    }
    return true;
  };

  const getLocationHandler = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      //   props.onLocationPicked({
      //     lat: location.coords.latitude,
      //     lng: location.coords.longitude,
      //   });
    } catch (err) {
      Alert.alert(
        "Could not fetch location!",
        "Please try again later or pick a location on the map.",
        [{ text: "Ok" }]
      );
    }
    setIsFetching(false);
  };

  const pickOnMapHandler = () => {
    navigation.navigate("Map", {
      initialLocation: pickedLocation,
    });
  };

  return (
    <View style={styles.locationPicker}>
      <MapPreview
        style={styles.mapPreview}
        location={pickedLocation}
        onPress={pickOnMapHandler}
      >
        {isFetching ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <Text>No location chosen yet!</Text>
        )}
      </MapPreview>
      <View style={styles.actions}>
        <Button
          title="Pick on Map"
          onPress={pickOnMapHandler}
          buttonStyle={{ width: 400 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15,
  },
  mapPreview: {
    marginBottom: 10,
    width: "100%",
    height: 230,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  actions: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default LocationPicker;
