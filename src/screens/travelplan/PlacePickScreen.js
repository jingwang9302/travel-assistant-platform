import React, {
  useState,
  useCallback,
  createRef,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

import { GROUP_SERVICE, PLAN_SERVICE } from "../../config/urls";
import { useDispatch, useSelector } from "react-redux";

import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Button, Input, Icon } from "react-native-elements";
import { config } from "../../../config";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";

//import Colors from "../constants/Colors";
//import * as placesActions from "../store/places-actions";
//import ImagePicker from "../components/ImagePicker";
import LocationPicker from "../../components/travelgroup_and_travelplan/LocationPicker";

import {
  addDeparturePlace,
  addDestinationPlace,
} from "../../redux/actions/travelPlanAction";

const PlacePickScreen = ({ navigation, route }) => {
  const [placeTitle, setPlaceTitle] = useState("");
  const [placeTitleInputError, setPlaceTitleInputError] = useState("");
  //   const [selectedImage, setSelectedImage] = useState();
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 37.785834,
    lng: -122.406417,
  });
  const [selectedPlace, setSelectedPlace] = useState({
    placeId: "",
    title: "Place",
    lat: 37.785834,
    lng: -122.406417,
    address: "",
  });
  const userProfile = useSelector((state) => state.user);

  //get this from mapscreen
  let { pickedLocationFromMap, placeInfo } = route.params;
  const dispatch = useDispatch();
  const placeTitleInputRef = useRef();

  let placeTitle_S = "";
  let errorMessage_S = "";

  //   useEffect(() => {
  //     if (pickedLocationFromMap) {
  //       console.log("location from map");
  //       console.log(pickedLocationFromMap.lng);
  // setSelectedLocation(pickedLocationFromMap);
  //     }
  //   }, [pickedLocationFromMap]);
  if (!pickedLocationFromMap) {
    pickedLocationFromMap = { lat: 37.785834, lng: -122.406417 };
  }

  React.useLayoutEffect(() => {
    console.log(`layout ${placeTitle}`);
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <OverflowMenu
            style={{ marginRight: 30 }}
            OverflowIcon={() => <Icon name="add" size={30} color="skyblue" />}
          >
            <HiddenItem
              title="Add as Destination"
              onPress={() => {
                savePlace("destination");
              }}
            />
            <HiddenItem
              title="Add as Departure"
              onPress={() => {
                savePlace("departure");
              }}
            />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [placeInfo, placeTitle, pickedLocationFromMap]);

  const locationPickedHandler = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  const savePlace = (type) => {
    console.log(`save clicked placeTitel is ${placeTitle}`);
    if (!placeTitle) {
      setPlaceTitleInputError("Please Input Place Title");
      return;
    }

    if (!placeInfo) {
      Alert.alert("Warning", "Please Pick a Place");
      return;
    }
    if (type === "departure") {
      dispatch(addDeparturePlace({ ...placeInfo, title: placeTitle }));
      Alert.alert("Success", "Departure Place is Added");
    } else {
      dispatch(addDestinationPlace({ ...placeInfo, title: placeTitle }));
      Alert.alert("Success", "Destination Place is Added");
    }
    setPlaceTitle("");
  };
  const clearInputCallback = useCallback(() => {
    setPlaceTitle("");
    setPlaceTitleInputError("");
    console.log(`after close: placetitle is ${placeTitle}`);
    console.log(`after close input error is ${placeTitleInputError}`);
  }, [placeTitle]);

  const clearTitleInput = () => {
    setPlaceTitle("");
    setPlaceTitleInputError("");
    console.log(`after close: placetitle is ${placeTitle}`);
    console.log(`after close input error is ${placeTitleInputError}`);
  };

  const fetchLoaction = () => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=48.8152937,2.4597668&key=${config.PLACES_API_KEY}`
      )
      .then((res) => {
        console.log(res.data);
        const result = res.data.results[0];
        const address = result.formatted_address;
        const placeId = result.place_id;
        const { lat } = result.geometry.location;
        const { lng } = result.geometry.location;
        console.log(
          `address: ${address}; place_id: ${placeId}; lat: ${lat}; lng: ${lng}`
        );
        setSelectedPlace({ placeId, title: placeTitle, lat, lng, address });
      })
      .catch((error) => {
        console.log(error.response.data.error_message);
        Alert.alert("Failed!", "feching google place has problem");
      });
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={{ marginHorizontal: 10, marginTop: 10 }}>
          <Input
            style={styles.inputStyle}
            onChangeText={(input) => {
              setPlaceTitle(input);
              console.log(`test change placetitle is${placeTitle}`);
            }}
            underlineColorAndroid="#f000"
            placeholder="Input Place Title"
            placeholderTextColor="#8b9cb5"
            autoCapitalize="sentences"
            value={placeTitle}
            ref={placeTitleInputRef}
            errorMessage={placeTitleInputError}
            blurOnSubmit={false}
            leftIcon={
              <Icon
                name="account"
                size={24}
                type="material-community"
                color="black"
              />
            }
            rightIcon={
              <Icon name="close" size={20} onPress={clearTitleInput} />
            }
          />
        </View>

        <LocationPicker
          navigation={navigation}
          mapPickedLocation={pickedLocationFromMap}

          //onLocationPicked={locationPickedHandler}
        />
        {placeInfo ? (
          <View>
            <Text>Place Picked From Map: </Text>
            <Text style={styles.label}>{placeInfo.address}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 15,
  },
  label: {
    fontSize: 18,
    marginTop: 15,
  },
  textInput: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});

export default PlacePickScreen;
