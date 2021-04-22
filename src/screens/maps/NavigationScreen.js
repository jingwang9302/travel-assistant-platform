import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import MapViewDirections from "react-native-maps-directions";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  AnimatedRegion,
} from "react-native-maps";
import { useSelector } from "react-redux";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { config } from "../../../config";
import { Ionicons } from "@expo/vector-icons";
import SOSButton from "../../components/map/SOSButton";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const NavigationScreen = ({ route, navigation }) => {
  const mapView = useRef();

  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const info = route.params;
  // address, latitude, longitude, place_id, title, url = info.info

  const { address, latitude, longitude } = info.info;

  const { ongoingPlan } = useSelector((state) => state.plans);

  const { currentLocation, loading, error, endNavigation } = useCurrentLocation(
    true
  );
  if (!currentLocation) {
    return (
      <View>
        <Text>Please wait while we get your navigation map.</Text>
      </View>
    );
  }
  const initRegion = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };
  const origin = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
  };
  const destination = { latitude: latitude, longitude: longitude };

  function renderDestinationHeader() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: height * 0.05,
            width: width * 0.95,
            paddingHorizontal: 2,
            paddingVertical: 1,
            borderRadius: 12,
            backgroundColor: "white",
          }}
        >
          <Ionicons name="md-navigate-circle-outline" size={26} color="grey" />
          <View style={{ flex: 1 }}>
            <Text>{address}</Text>
          </View>
          <Text>{Math.ceil(duration)} mins </Text>
        </View>
      </View>
    );
  }

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
        minZoomLevel={15}
        // camera={initRegion}
        region={initRegion}
      >
        <Marker coordinate={info.info} anchor={{ x: 0.5, y: 0.5 }} />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={config.PLACES_API_KEY}
          strokeWidth={4}
          strokeColor="hotpink"
          timePrecision="now"
          onReady={(result) => {
            setDuration(result.duration);
            if (!isReady) {
              //   mapView.current.fitToCoordinates(result.coordinate, {
              //     edgePadding: {
              //       right: width / 20,
              //       bottom: height / 4,
              //       left: width / 20,
              //       top: height / 8,
              //     },
              //   });

              setIsReady(true);
            }
          }}
        />
      </MapView>
      {renderDestinationHeader()}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.buttonContainer}>
          <Button
            type="solid"
            title="End Navigation"
            onPress={() => {
              endNavigation();
              navigation.navigate("Search");
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            type="solid"
            title="Modify Plan"
            onPress={() => {
              navigation.replace("Search");
            }}
          />
        </View>
      </View>
      {ongoingPlan && (
        <SOSButton
          style={{ position: "absolute", top: 0.05 * height, zIndex: 999 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: { height: "93%" },
  buttonContainer: { flex: 1, paddingHorizontal: 2 },
});

export default NavigationScreen;
