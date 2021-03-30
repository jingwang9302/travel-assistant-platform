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
import Polyline from "@mapbox/polyline";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import MapInput from "../../components/MapInput";
import ResultList from "./ResultsList";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { config } from "../../../config";

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
  const [navigationInfo, setNavigationInfo] = useState(null);
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

  const getDirections = async (startLoc, desLoc) => {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=${config.DIRECTION_API_KEY}`
      );
      const respJson = await resp.json();
      const response = respJson.routes[0];
      const distanceTime = response.legs[0];
      const distance = distanceTime.distance.text;
      const time = distanceTime.duration.text;
      const points = Polyline.decode(
        respJson.routes[0].overview_polyline.points
      );
      const coords = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      setNavigationInfo({ coords, distance, time });
      // console.log(navigationInfo);
      console.log(coords);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const mergeCoods = (desLocation) => {
    if (desLocation) {
      const { desLatitude, desLongitude } = desLocation;
      const hasStartAndEnd =
        currentLocation.latitude !== null && desLatitude !== null;
      if (hasStartAndEnd) {
        const concatStart = `${currentLocation.latitude},${currentLocation.longitude}`;
        const concatEnd = `${desLatitude},${desLongitude}`;
        console.log("concat location", concatEnd);
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
        region={region || initRegion}
        onPress={(e) => {
          if (e.nativeEvent.action) return;
          setMarker([e.nativeEvent.coordinate]);
        }}
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
                // onPress={() => {
                //   navigation.navigate("Result", { result: item });
                // }}
                tooltip
              >
                <View style={styles.bubble}>
                  <Text>{item.title}</Text>
                  <Text>{item.address}</Text>
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
            top: height - 392,
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
            <Text style={{ backgroundColor: "white", fontSize: 18 }}>
              {`${curMarker.title}`}
            </Text>
            <Text style={{ backgroundColor: "white", fontSize: 15 }}>
              {curMarker.address}
            </Text>
            <Text style={{ fontSize: 15 }}>
              {`Estimate time: ${navigationInfo.time}        Distance: ${navigationInfo.distance}`}
            </Text>
            <Button
              // style={styles.button}
              onPress={() => {
                console.log("button pressed for nothing");
              }}
              icon={<Icon name="arrow-right" size={20} color="white" />}
              iconRight
              title="Go Here"
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
      {/* <View>
        <ResultList />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mapInput: { position: "absolute", width: width },
  map: { height: "100%" },
  button: {
    width: width,
    height: 60,
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
