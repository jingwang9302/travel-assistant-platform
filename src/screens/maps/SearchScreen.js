import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import MapInput from "../../components/MapInput";
import ResultList from "./ResultsList";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import useDirection from "../../hooks/useDirection";
import { useSelector } from "react-redux";
import SOSButton from "../../components/map/SOSButton";
import UsersLocationButton from "../../components/map/UsersLocationButton";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const SearchScreen = ({ navigation }) => {
  let [region, setRegion] = useState(null);
  const [marker, setMarker] = useState([]);
  const [curMarker, setCurMarker] = useState(null);
  const { navigationInfo, getDirections } = useDirection();
  const { ongoingPlan } = useSelector((state) => state.plans);
  const [showCard, setShowCard] = useState(true);
  // const ongoingPlan = "123";
  const { currentLocation, loading, error } = useCurrentLocation();
  if (!currentLocation) {
    return (
      <View>
        <Text>Loading location...</Text>
      </View>
    );
  }

  const initRegion = {
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const mergeCoods = (desLocation) => {
    if (desLocation) {
      const { desLatitude, desLongitude } = desLocation;
      const hasStartAndEnd =
        currentLocation.latitude !== null && desLatitude !== null;
      if (hasStartAndEnd) {
        const concatStart = `${currentLocation.latitude},${currentLocation.longitude}`;
        const concatEnd = `${desLatitude},${desLongitude}`;
        getDirections(concatStart, concatEnd);
      }
    }
  };

  return (
    <View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={initRegion}
        loadingEnabled
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
        followsUserLocation={true}
        region={region || initRegion}
      >
        {navigationInfo &&
          navigationInfo.coords &&
          navigationInfo.coords.length > 0 && (
            <MapView.Polyline
              strokeWidth={2}
              strokeColor="red"
              coordinates={navigationInfo.coords}
            />
          )}
        {marker.length > 0 &&
          marker.map((item) => (
            <Marker
              coordinate={item}
              title={item.title}
              key={item.place_id}
              onPress={() => {
                const desLocation = {
                  desLatitude: item.latitude,
                  desLongitude: item.longitude,
                };
                mergeCoods(desLocation);
                setCurMarker(item);
              }}
            >
              <Callout
                onPress={() => {
                  navigation.navigate("Result", { result: item });
                }}
                tooltip
              >
                <View style={styles.bubble}>
                  <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                  <Text style={{ fontSize: 12 }}>{item.address}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>
      {showCard && curMarker && typeof curMarker.url === "string" && (
        <View
          style={{
            backgroundColor: "#e0e0e0",
            position: "absolute",
            bottom: 0,
            width: width - 10,
            alignSelf: "center",
          }}
        >
          {/* Image touchable opacity */}
          <View>
            <Text style={{ fontSize: 10, fontFamily: "Helvetica" }}>
              Click the image to see more
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: "grey" }}
              onPress={() => {
                navigation.navigate("Result", { result: curMarker });
              }}
            >
              <Image
                source={{
                  uri: curMarker.url,
                }}
                style={{
                  width: width - 15,
                  alignSelf: "center",
                  height: height * 0.15,
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: 3 }}>
            {/* Info Text: title, address, time & distance */}
            <View>
              {/* Title */}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {`${curMarker.title}`}
              </Text>

              {/* Address text */}
              <Text style={{ fontSize: 15 }}>{curMarker.address}</Text>

              {/* Estimate time and distance */}
              {navigationInfo && (
                <Text style={{ fontSize: 15 }}>
                  {`Estimate time: ${navigationInfo.time}        Distance: ${navigationInfo.distance}`}
                </Text>
              )}
            </View>

            {/* Three buttons */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  height: 30,
                  backgroundColor: "#00b2ff",
                  borderRadius: 5,
                }}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    width: Math.ceil((width - 12) / 3),
                    alignItems: "center",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 15 }}> Show Route</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 30,
                }}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    width: Math.ceil((width - 12) / 3),
                    paddingHorizontal: 2,
                    alignItems: "center",
                    backgroundColor: "#00b2ff",
                    flex: 1,
                    justifyContent: "center",
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    navigation.navigate("Navigation", { info: curMarker });
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 15 }}>Start Navigation</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: 30,
                }}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    width: Math.ceil((width - 12) / 3),
                    paddingHorizontal: 2,
                    alignItems: "center",
                    backgroundColor: "#00b2ff",
                    flex: 1,
                    justifyContent: "center",
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    setShowCard(false);
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 15 }}> Close Card</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.mapInput}>
        <MapInput
          setRegion={setRegion}
          setMarker={setMarker}
          currentLocation={currentLocation}
          setShowCard={setShowCard}
        />
      </View>
      {ongoingPlan && (
        <SOSButton style={{ position: "absolute", top: 0.05 * height }} />
      )}

      {curMarker && ongoingPlan && (
        <UsersLocationButton
          style={{ position: "absolute", top: 0.05 * height }}
          marker={curMarker}
        />
      )}

      {/* <View>
        <ResultList />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mapInput: { position: "absolute", width: width },
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
  buttonContainer: { flex: 1, paddingHorizontal: 2 },
});

export default SearchScreen;
