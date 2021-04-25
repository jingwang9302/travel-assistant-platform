import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Input, Icon } from "react-native-elements";
import { config } from "../../../config";
import {
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";

import LocationPicker from "../../components/travelgroup_and_travelplan/LocationPicker";

import {
  addDeparturePlace,
  addDestinationPlace,
} from "../../redux/actions/travelPlanAction";

const PlacePickScreen = ({ navigation, route }) => {
  const [placeTitle, setPlaceTitle] = useState("");
  const [placeTitleInputError, setPlaceTitleInputError] = useState("");
  //get this from mapscreen
  let { pickedLocationFromMap, placeInfo } = route.params;
  const dispatch = useDispatch();
  const placeTitleInputRef = useRef();

  if (!pickedLocationFromMap) {
    pickedLocationFromMap = { lat: 37.785834, lng: -122.406417 };
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <OverflowMenu
            style={{ marginRight: 30 }}
            OverflowIcon={() => <Icon name="add" size={30} color="blue" />}
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

  const savePlace = (type) => {
    // console.log(`save clicked placeTitel is ${placeTitle}`);
    if (!placeTitle) {
      setPlaceTitleInputError("Please Input Place Title");
      return;
    }
    // if (!route.params?.placeInfo) {
    //   Alert.alert("Alert", "Please Pick a Place");
    //   return;
    // }

    if (!placeInfo) {
      Alert.alert("Alert", "Please Pick a Place");
      return;
    }
    if (type === "departure") {
      dispatch(addDeparturePlace({ ...placeInfo, title: placeTitle }));
      //Alert.alert("Success", "Departure Place is Added");
    } else {
      dispatch(addDestinationPlace({ ...placeInfo, title: placeTitle }));
      //Alert.alert("Success", "Destination Place is Added");
    }

    setPlaceTitle("");
    navigation.goBack();
  };

  const clearTitleInput = () => {
    setPlaceTitle("");
    setPlaceTitleInputError("");
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={{ marginHorizontal: 10, marginTop: 10 }}>
          <Input
            style={styles.inputStyle}
            onChangeText={(input) => {
              setPlaceTitle(input);
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
                name="reader-outline"
                size={24}
                type="ionicon"
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
        />
        {placeInfo ? (
          <View>
            <Text style={styles.label}>Place Picked From Map: </Text>
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
