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
import axios from "axios";
import { PLAN_SERVICE, USER_SERVICE } from "../../config/urls";
import SOSButton from "../../components/map/SOSButton";

const { height, width } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA;

const UsersLocationScreen = ({ route, navigation }) => {
  const mapView = useRef();
  const marker = route.params.marker;
  console.log(marker);
  const { address, latitude, longitude, title } = marker;

  // const initusersList = [
  //   {
  //     _id: "6077e99aeb8947000a300cd9",
  //     planId: "6069327483e40856e49c5925",
  //     userId: 1,
  //     __v: 0,
  //     lat: 37.3688,
  //     lng: -122.0363,
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
  //     lat: 37.323,
  //     lng: -122.0322,
  //   },
  // ];
  const [usersList, setUsersList] = useState(null);
  const [author, setAuthor] = useState(null);

  const initRegion = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const { ongoingPlan } = useSelector((state) => state.plans);
  // const ongoingPlan = "123";

  const userProfile = useSelector((state) => state.user);
  const getAuthor = (authorId) => {
    axios({
      method: "get",
      url: USER_SERVICE + "/profile/basic/" + authorId,
      headers: {
        Authorization: "Bearer " + userProfile.token,
      },
    })
      .then(function (response) {
        setAuthor(response.data);
        console.log(author);
      })
      .catch(function (error) {
        if (error.response.data.message === null) {
          console.log(error.message);
        } else {
          console.log(error.response.data.message);
        }
      });
  };

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
          userName: getAuthor(user.userId),
          latitude: user.lat,
          longitude: user.lng,
        };
        console.log(res);
        return res;
      });
      setUsersList(usersCoords);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  let timer = null;

  const endTimer = () => {
    timer && clearInterval(timer);
  };

  // fetch users location and render on map every 10 seconds
  useEffect(() => {
    navigation.addListener("focus", () => {
      if (ongoingPlan) {
        timer = setInterval(() => {
          fetchUsersLocation();
        }, 10000);
      }
    });
    timer && clearInterval(timer);
  }, []);

  //clear timer when unfocus
  useEffect(() => {
    navigation.addListener("blur", () => {
      endTimer();
    });
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
        minZoomLevel={2}
        region={initRegion}
      >
        <Marker
          coordinate={marker}
          title={title}
          image={{
            uri:
              "https://icons.iconarchive.com/icons/icons-land/vista-map-markers/128/Map-Marker-Flag-1-Right-Pink-icon.png",
          }}
          // anchor={{ x: 0.5, y: 0.5 }}
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
            <Marker
              coordinate={user}
              key={user.userId}
              title={author.firstName + author.lastName}
              image={{
                uri:
                  "https://icons.iconarchive.com/icons/icons-land/vista-map-markers/128/Map-Marker-Ball-Azure-icon.png",
              }}
            />
          ))}
      </MapView>
      {ongoingPlan && (
        <SOSButton style={{ position: "absolute", top: 0.05 * height }} />
      )}
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
