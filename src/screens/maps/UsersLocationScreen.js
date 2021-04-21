import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import { useSelector } from "react-redux";
import { Button, Icon } from "react-native-elements";
import { sendSOSToOngoingPlanGroupChat } from "../../utils/MessagingUtils";
import { PLAN_SERVICE } from "../../config/urls";

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

  // const initusersList = [
  //   {
  //     _id: "6077e99aeb8947000a300cd9",
  //     planId: "6069327483e40856e49c5925",
  //     userId: 1,
  //     __v: 0,
  //     lat: 37.2329,
  //     lng: -122.406417,
  //   },
  //   {
  //     _id: "6077e99aeb8947000a300cd0",
  //     planId: "6069327483e40856e49c5925",
  //     userId: 2,
  //     __v: 0,
  //     lat: 37.3359902,
  //     lng: -122.0153873,
  //   },
  //   {
  //     _id: "6077e99aeb8947000a300cd1",
  //     planId: "6069327483e40856e49c5925",
  //     userId: 3,
  //     __v: 0,
  //     lat: 37.7749,
  //     lng: -122.4194,
  //   },
  // ];
  const [usersList, setUsersList] = useState(null);

  const initRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const { ongoingPlan } = useSelector((state) => state.plans);
  const currentUserProfile = useSelector((state) => state.user);
  // const ongoingPlan = "123";

  // Fetch users' location from PlanService
  const fetchUsersLocation = async () => {
    try {
      const url = `${PLAN_SERVICE}ongoing/${ongoingPlan}`;
      const resp = await fetch(url);
      const respJson = await resp.json();
      const usersInfo = respJson.data;
      const usersCoords = usersInfo.map((user) => {
        const res = {
          userId: user.userId,
          latitude: user.lat,
          longitude: user.lng,
        };
        return res;
      });
      setUsersList(usersCoords);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // fetch users location and render on map every 10 seconds
  useEffect(() => {
    let mounted = true;
    if (ongoingPlan) {
      const timer = setInterval(() => {
        fetchUsersLocation();
      }, 10000);
      return () => {
        clearInterval(timer);
        mounted = false;
      };
    }
  }, []);

  function renderSOSButton() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: width * 0.85,
          right: 0,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: height * 0.05,
            width: height * 0.05,
            // paddingHorizontal: 1,
            paddingLeft: 6,
            paddingVertical: 1,
            borderRadius: 20,
            backgroundColor: "red",
          }}
          onPress={() => {
            sendSOSToOngoingPlanGroupChat(currentUserProfile, ongoingPlan);
            alert("SOS message sent.");
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>SOS</Text>
          </View>
        </TouchableOpacity>
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
        // minZoomLevel={10}
        // camera={initRegion}
        region={initRegion}
      >
        <Marker
          coordinate={info.marker.info}
          title={title}
          anchor={{ x: 0.5, y: 0.5 }}
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
      {ongoingPlan && renderSOSButton()}
      <View>
        <Button>SOS</Button>
      </View>
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
