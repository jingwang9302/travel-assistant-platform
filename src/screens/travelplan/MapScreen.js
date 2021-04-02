import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";
import axios from "axios";
import { PLACES_API_KEY } from "../../config/config";

//import Colors from "../constants/Colors";
import Loader from "../../components/Loader";

const MapScreen = ({ navigation, route }) => {
  const { initialLocation, readOnly } = route.params;
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(false);
  console.log("initial locaiton");
  console.log(
    `initial lat: ${initialLocation.lat}; lng: ${initialLocation.lng}`
  );
  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  React.useLayoutEffect(() => {
    if (!readOnly) {
      navigation.setOptions({
        headerRight: () => (
          <HeaderButtons>
            <Item
              style={{ marginRight: 15, justifyContent: "center" }}
              title="Add"
              onPress={() => {
                fetchLocationInfo();
              }}
            />
          </HeaderButtons>
        ),
      });
    }
  }, [selectedLocation]);

  const fetchLocationInfo = () => {
    setLoading(true);
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.lat},${selectedLocation.lng}&key=${PLACES_API_KEY}`
      )
      .then((res) => {
        const result = res.data.results[0];
        console.log(result);

        const address = result.formatted_address;
        const placeId = result.place_id;
        const { lat } = result.geometry.location;
        const { lng } = result.geometry.location;
        const place = { placeId, address, lat, lng };
        console.log("place is: ");
        console.log(`${place.address}`);
        setLoading(false);

        navigation.navigate("PlacePick", {
          placeInfo: place,
          pickedLocationFromMap: { lat, lng },
        });
      })
      .catch((error) => {
        console.log(error.response.data.error.errors);
        setLoading(false);
        Alert.alert("Failed!", "feching google place has problem");
      });
  };

  const selectLocationHandler = (event) => {
    if (readOnly) {
      return;
    }
    console.log("new picked location ");
    console.log(
      event.nativeEvent.coordinate.latitude,
      event.nativeEvent.coordinate.longitude
    );
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  //   const savePickedLocationHandler = () => {
  //     if (!selectedLocation) {
  //       Alert.alert("Warning", "You have to pick a place on the map");
  //       return;
  //     }
  //     navigation.navigate("PlacePick", {
  //       pickedLocationFromMap: selectedLocation,
  //     });
  //   };

  // useEffect(() => {
  //   props.navigation.setParams({ saveLocation: savePickedLocationHandler });
  // }, [savePickedLocationHandler]);

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    };
  }

  return (
    <MapView
      style={styles.map}
      region={mapRegion}
      onPress={selectLocationHandler}
    >
      <Loader loading={loading} />
      {markerCoordinates && (
        <Marker title="Picked Location" coordinate={markerCoordinates} />
      )}
    </MapView>
  );
};

// MapScreen.navigationOptions = (navData) => {
//   const saveFn = navData.navigation.getParam("saveLocation");
//   const readonly = navData.navigation.getParam("readonly");
//   if (readonly) {
//     return {};
//   }
//   return {
//     headerRight: (
//       <TouchableOpacity style={styles.headerButton} onPress={saveFn}>
//         <Text style={styles.headerButtonText}>Save</Text>
//       </TouchableOpacity>
//     ),
//   };
// };

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  headerButton: {
    marginHorizontal: 20,
  },
  //   headerButtonText: {
  //     fontSize: 16,
  //     color: Platform.OS === "android" ? "white" : "",
  //   },
});

export default MapScreen;
