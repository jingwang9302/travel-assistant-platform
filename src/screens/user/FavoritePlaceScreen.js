import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Fab } from "native-base";
import { Rating, Icon, ListItem, Overlay } from "react-native-elements";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { config } from "../../../config";
import axios from "axios";
import { USER_SERVICE } from "../../config/urls";
import { useSelector } from "react-redux";

const FavoritePlaceScreen = ({ navigation }) => {
  const userProfile = useSelector((state) => state.user);
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const [visible, setVisible] = useState(false);
  const [placeDetailVisible, setPlaceDetailVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: 37.42362320301861,
    longitude: -122.08424126696157,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [place, setPlace] = useState(null);
  const [placeDetail, setPlaceDetail] = useState(null);
  const [viewPlace, setViewPlace] = useState(null);
  const mapRef = useRef(null);
  const mapDetailRef = useRef(null);

  useEffect(() => {
    getFavoritePlaces();
  }, []);

  const getFavoritePlaces = () => {
    axios({
      method: "get",
      url: USER_SERVICE + "/places/detail/" + userProfile.id,
      headers: {
        Authorization: "Bearer " + userProfile.token,
      },
    })
      .then(function (response) {
        setFavoritePlaces(response.data);
      })
      .catch(function (error) {
        console.log(error.response);
      });
  };

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const togglePlaceDetail = () => {
    setPlaceDetailVisible(!placeDetailVisible);
  };

  const showMyLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    let myLocation = await Location.getCurrentPositionAsync({ accuracy: 6 });
    // console.log(myLocation);

    if (myLocation !== null) {
      mapRef.current.animateCamera({
        center: {
          latitude: myLocation.coords.latitude,
          longitude: myLocation.coords.longitude,
        },
      });
    }
  };

  const addFavoritePlace = () => {
    if (placeDetail === null) {
      alert("Please select a place");
      return;
    }
    Alert.alert(
      "Add to Favorite Place?",
      "Are you sure to add " + placeDetail.name + "?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            axios({
              method: "post",
              url: USER_SERVICE + "/places",
              headers: {
                Authorization: "Bearer " + userProfile.token,
              },
              data: {
                userId: userProfile.id,
                placeId: placeDetail.place_id,
                placeName: placeDetail.name,
                placeAddress: placeDetail.formatted_address,
                placeLat: placeDetail.geometry.location.lat,
                placeLng: placeDetail.geometry.location.lng,
                placePhone: placeDetail.formatted_phone_number,
                placeRating: placeDetail.rating,
              },
            })
              .then(function (response) {
                getFavoritePlaces();
                setVisible(false);
              })
              .catch(function (error) {
                if (error.response.data.message === null) {
                  alert(error.message);
                } else {
                  alert(error.response.data.message);
                }
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const deleteFavoritePlace = (place) => {
    Alert.alert(
      "Delete Place?",
      "Are you sure to delete " + place.placeName + "?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            axios({
              method: "delete",
              url:
                USER_SERVICE +
                "/places/" +
                userProfile.id +
                "/" +
                place.placeId,
              headers: {
                Authorization: "Bearer " + userProfile.token,
              },
            })
              .then(function (response) {
                getFavoritePlaces();
              })
              .catch(function (error) {
                console.log(error.response);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const showPlaceDetail = (item) => {
    setPlaceDetailVisible(true);
    setViewPlace(item);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView>
          {favoritePlaces.length === 0
            ? null
            : favoritePlaces.map((item, i) => (
                <ListItem
                  key={i}
                  bottomDivider
                  onPress={() => {
                    showPlaceDetail(item);
                  }}
                >
                  <ListItem.Content>
                    <ListItem.Title style={{ fontWeight: "bold" }}>
                      {item.placeName}
                    </ListItem.Title>
                    <Rating
                      imageSize={15}
                      readonly
                      fractions={1}
                      startingValue={item.placeRating}
                    />
                    <Text>{item.placeAddress}</Text>
                  </ListItem.Content>
                  <Icon
                    name="minus"
                    type={"antdesign"}
                    onPress={() => {
                      deleteFavoritePlace(item);
                    }}
                  />
                </ListItem>
              ))}
        </ScrollView>
      </View>
      <View>
        <Fab
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: "#96c8e9" }}
          position="bottomRight"
          onPress={() => setVisible(true)}
        >
          <Icon name="plus" type={"antdesign"} />
        </Fab>
        <Overlay
          overlayStyle={styles.OverlayStyle}
          isVisible={visible}
          onBackdropPress={toggleOverlay}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flex: 0.1 }}>
              <GooglePlacesAutocomplete
                placeholder="Search"
                fetchDetails={true}
                onPress={(data, details) => {
                  // 'details' is provided when fetchDetails = true
                  // console.log(data);
                  setPlace(data);
                  // console.log(details);
                  setPlaceDetail(details);

                  mapRef.current.animateCamera({
                    center: {
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                    },
                  });
                }}
                query={{
                  key: config.PLACES_API_KEY,
                  language: "en",
                }}
                styles={{
                  container: {
                    flex: 1,
                  },
                  textInputContainer: {
                    flexDirection: "row",
                    height: 30,
                  },
                  textInput: {
                    backgroundColor: "#FFFFFF",
                    height: 30,
                    borderRadius: 5,
                    paddingVertical: 0,
                    paddingHorizontal: 5,
                    fontSize: 15,
                    flex: 1,
                  },
                  listView: {
                    zIndex: 10,
                    width: "100%",
                    height: 200,
                    backgroundColor: "#fff",
                    position: "absolute",
                    top: 30,
                  },
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <MapView
                ref={mapRef}
                initialRegion={region}
                style={{ flex: 1 }}
                zoomEnabled={true}
                showsMyLocationButton={true}
                showsUserLocation={true}
                onMapReady={() => {
                  showMyLocation();
                }}
              >
                {place !== null && placeDetail !== null ? (
                  <Marker
                    coordinate={{
                      latitude: placeDetail.geometry.location.lat,
                      longitude: placeDetail.geometry.location.lng,
                    }}
                  >
                    <Callout
                      onPress={() => {
                        addFavoritePlace();
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          length: 80,
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 5,
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                          {placeDetail.name} {placeDetail.rating}/5
                        </Text>
                        <Text style={{ fontSize: 13 }}>
                          {placeDetail.formatted_address}
                        </Text>
                        <Text style={{ color: "#165470" }}>
                          Tap to add to your favorite places
                        </Text>
                      </View>
                    </Callout>
                  </Marker>
                ) : null}
              </MapView>
            </View>
            <View>
              <TouchableOpacity
                style={styles.buttonStyle}
                activeOpacity={0.5}
                onPress={() => {
                  showMyLocation();
                }}
              >
                <Text style={styles.buttonTextStyle}>My Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Overlay>
        <Overlay
          overlayStyle={styles.OverlayStyle}
          isVisible={placeDetailVisible}
          onBackdropPress={togglePlaceDetail}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 0.3,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {viewPlace ? viewPlace.placeName : ""}
              </Text>
              <Rating
                imageSize={15}
                readonly
                fractions={1}
                startingValue={viewPlace ? viewPlace.placeRating : ""}
              />
              <Text>{viewPlace ? viewPlace.placeAddress : ""}</Text>
              <Text>{viewPlace ? viewPlace.placePhone : ""}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <MapView
                ref={mapDetailRef}
                initialRegion={region}
                style={{ flex: 1 }}
                zoomEnabled={true}
                showsMyLocationButton={true}
                showsUserLocation={true}
                onMapReady={() => {
                  mapDetailRef.current.animateCamera({
                    center: {
                      latitude: viewPlace.placeLat,
                      longitude: viewPlace.placeLng,
                    },
                  });
                }}
              >
                {viewPlace !== null ? (
                  <Marker
                    coordinate={{
                      latitude: viewPlace.placeLat,
                      longitude: viewPlace.placeLng,
                    }}
                  ></Marker>
                ) : null}
              </MapView>
            </View>
          </View>
        </Overlay>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "#165470",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#165470",
    height: 25,
    alignItems: "center",
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 5,
    fontSize: 10,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  SectionStyle: {
    marginTop: 5,
    marginBottom: 10,
    margin: 5,
  },
  inputStyle: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
  },
  OverlayStyle: {
    width: "90%",
    height: "80%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  OverlayTitle: {
    color: "#000000",
    paddingVertical: 10,
    fontSize: 20,
  },
});

export default FavoritePlaceScreen;
