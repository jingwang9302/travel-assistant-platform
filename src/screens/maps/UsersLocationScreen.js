import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Callout,
  AnimatedRegion,
} from "react-native-maps";
import { config } from "../../../config";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const UsersLocationScreen = ({ route, navigation }) => {
  const mapView = useRef();
  const info = route.params;
  const {
    address,
    latitude,
    longitude,
    place_id,
    title,
    url,
  } = info.marker.info;

  const initusersList = [
    { userId: "10001", latitude: 37.3359902, longitude: -122.0153873 },
    { userId: "10002", latitude: 37.3975726, longitude: -121.9128631 },
    { userId: "10003", latitude: 37.7749, longitude: -122.4194 },
  ];
  const [usersList, setUsersList] = useState(initusersList);

  const initRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  // fetch users location and render on map every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("call fetch user api");
      //setUsersState(new data)
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <MapView
        ref={mapView}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={initRegion}
        followsUserLocation={true}
        // minZoomLevel={10}
        // camera={initRegion}
        region={initRegion}
      >
        <Marker
          coordinate={info.marker.info}
          title={title}
          anchor={{ x: 0.5, y: 0.5 }}
          onPress={() => {
            // TODO, hide callout
          }}
        >
          <Callout tooltip>
            <View style={styles.bubble}>
              <Text style={{ fontWeight: "bold" }}>{title}</Text>
              <Text style={{ fontSize: 12 }}>{address}</Text>
            </View>
          </Callout>
        </Marker>
        {usersList &&
          usersList.map((user) => (
            <Marker coordinate={user} key={user.userId} />
          ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: { height: "100%" },
  bubble: {
    // flex: 1,
    backgroundColor: "rgb(255,255,255)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    width: 160,
    height: 80,
    opacity: 0.8,
  },
});

export default UsersLocationScreen;
