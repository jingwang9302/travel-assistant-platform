import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
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

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;

const SearchScreen = ({ navigation }) => {
  let [region, setRegion] = useState(null);
  const [marker, setMarker] = useState([]);
  const [curMarker, setCurMarker] = useState(null);
  const { navigationInfo, getDirections } = useDirection();
  // const { ongoingPlan } = useSelector((state) => state.plans);
  const { ongoingPlan } = "123";
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
    console.log("merge coords");
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
  // console.log(navigationInfo);

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
      {curMarker && typeof curMarker.url === "string" && (
        <View
          style={{
            backgroundColor: "white",
            position: "absolute",
            top: 0.51 * height,
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Result", { result: curMarker });
            }}
          >
            <Image
              source={{
                uri: curMarker.url,
              }}
              style={{
                width: width,
                alignSelf: "center",
                height: height * 0.15,
              }}
            />
          </TouchableOpacity>

          <View>
            <Text
              style={{
                backgroundColor: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {`${curMarker.title}`}
            </Text>
            <Text style={{ backgroundColor: "white", fontSize: 15 }}>
              {curMarker.address}
            </Text>
            {navigationInfo && (
              <Text style={{ fontSize: 15 }}>
                {`Estimate time: ${navigationInfo.time}        Distance: ${navigationInfo.distance}`}
              </Text>
            )}
            <Button
              onPress={() => {
                // unsubscribe;
                navigation.navigate("Navigation", { info: curMarker });
              }}
              icon={<Icon name="arrow-right" size={20} color="white" />}
              iconRight
              title="Start Navigation"
            />
          </View>
        </View>
      )}

      <View style={styles.mapInput}>
        <MapInput
          setRegion={setRegion}
          setMarker={setMarker}
          currentLocation={currentLocation}
        />
      </View>
      {<SOSButton style={{ position: "absolute", top: 0.05 * height }} />}

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
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },

  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },

  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
});

export default SearchScreen;
