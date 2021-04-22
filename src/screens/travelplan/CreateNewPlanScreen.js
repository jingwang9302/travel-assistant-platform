import React, { createRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";

import axios from "axios";
import {
  ActivityIndicator,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from "react-native";

import { USER_SERVICE, GROUP_SERVICE, PLAN_SERVICE } from "../../config/urls";

import Loader from "../../components/Loader";
import {
  Icon,
  Input,
  Image,
  header,
  Button,
  Divider,
  ListItem,
  Avatar,
} from "react-native-elements";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";

import LoginAlertScreen from "../user/LoginAlertScreen";
import {
  clearDepartureAndDestinationAddress,
  removeDeparturPlace,
  removeDestinationPlace,
} from "../../redux/actions/travelPlanAction";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreateNewPlanScreen = ({ navigation }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [estimatedStartTime, setEstimatedStartTime] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [departure, setDeparture] = useState("");
  const [selectedImage, setSelectedImage] = useState({ localUri: "" });
  const [planCreated, setPlanCreated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [
    planDescriptionInputErrorMessage,
    setPlanDescriptionInputError,
  ] = useState("");
  const [planNameInputErrorMessage, setPlanNameInputError] = useState("");
  const [timeInputError, setTimeInputError] = useState("");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const userProfile = useSelector((state) => state.user);
  const { departureAddress, destinationAddress } = useSelector(
    (state) => state.plans
  );

  const dispatch = useDispatch();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            style={{ marginRight: 15, justifyContent: "center" }}
            title="Save"
            onPress={() => {
              createNewPlan();
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [
    planName,
    planDescription,
    destinationAddress,
    departureAddress,
    estimatedStartTime,
    date,
  ]);

  const openImagePickerAsync = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access images is required");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log("uri is:");
    console.log(pickerResult);
    if (pickerResult.cancelled === true) {
      return;
    }
    setSelectedImage({ localUri: pickerResult.uri });
  };
  const createNewPlan = () => {
    setErrorMessage("");
    setPlanNameInputError("");
    setPlanDescriptionInputError("");
    if (!planName) {
      setPlanNameInputError("Please enter the planName");
      return;
    }
    if (!planDescription) {
      setPlanDescriptionInputError("Please enter the description");
      return;
    }
    if (!date) {
      setTimeInputError("Please pick date and time");

      return;
    }
    const nowDate = new Date();
    if (date < nowDate) {
      setTimeInputError("Please pick the valid date and time ");
      return;
    }

    if (!destinationAddress || destinationAddress.length === 0) {
      Alert.alert("Warning", "Please Pick Destination Places");
      return;
    }
    if (!departureAddress) {
      departureAddress = {};
    }
    setLoading(true);
    axios({
      method: "POST",
      url: PLAN_SERVICE + "create/" + userProfile.id,
      data: {
        planName,
        planDescription,
        departureAddress,
        destinationAddress,
        startDate: date.toLocaleString(),
      },
    })
      .then((res) => {
        const { data } = res.data;
        setPlanCreated(data);
        //console.log(data);
        if (selectedImage.localUri) {
          upLoadImage(selectedImage.localUri, data._id);
        }
        setLoading(false);
        //clear departure and destination addresses in redux
        dispatch(clearDepartureAndDestinationAddress());
        navigation.navigate("PlanListTab", { planCreated: true });
      })
      .catch((error) => {
        //setErrorMessage(error.response.data.error);

        setLoading(false);
        //clear departure and destination addresses
        dispatch(clearDepartureAndDestinationAddress());
        Alert.alert("Creation Failed!", error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  const upLoadImage = (uri, planId) => {
    //const uri = selectedImage.localUri;
    const uriParts = uri.split(".");
    console.log("uri:");
    console.log(uri);
    //console.log(uriParts);
    const fileType = uriParts[uriParts.length - 1];
    console.log(`file type: ${fileType}`);
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    });

    axios({
      method: "PUT",
      url: PLAN_SERVICE + "updateimage/" + `${userProfile.id}/${planId}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        const { data } = res.data;
        console.log(`image name is ${data}`);
        setSelectedImage({
          localUri: `http://localhost:5001/uploads/${data}`,
        });
      })
      .catch((error) => {
        // setErrorMessage(error.response.data.error);
        Alert.alert("Creation Failed!", error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(!show);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <ScrollView>
      <View style={{ backgroundColor: "white" }}>
        <Loader loading={loading} />
        <KeyboardAvoidingView enabled>
          <View style={{ marginHorizontal: 10, marginTop: 10 }}>
            <Input
              style={styles.inputStyle}
              onChangeText={(input) => setPlanName(input)}
              underlineColorAndroid="#f000"
              placeholder="Input Travelplan Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              errorMessage={planNameInputErrorMessage}
              blurOnSubmit={false}
              value={planName}
              leftIcon={
                <Icon
                  name="reader-outline"
                  size={24}
                  type="ionicon"
                  color="black"
                />
              }
              rightIcon={
                <Icon
                  name="close"
                  size={20}
                  onPress={() => {
                    setPlanNameInputError("");
                    setPlanName("");
                    setErrorMessage("");
                  }}
                />
              }
            />
            <Input
              style={styles.inputStyle}
              onChangeText={(input) => {
                setPlanDescription(input);
              }}
              underlineColorAndroid="#f000"
              placeholder="Input Travelplan Description"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              errorMessage={planDescriptionInputErrorMessage}
              blurOnSubmit={false}
              value={planDescription}
              leftIcon={
                <Icon
                  name="reader-outline"
                  size={24}
                  type="ionicon"
                  color="black"
                />
              }
              rightIcon={
                <Icon
                  color="black"
                  name="close"
                  size={20}
                  onPress={() => {
                    setPlanDescriptionInputError("");
                    setPlanDescription("");
                    setErrorMessage("");
                  }}
                />
              }
            />
            <Input
              style={styles.inputStyle}
              // onChangeText={(input) => {
              //   setEstimatedStartTime(input);
              // }}
              underlineColorAndroid="#f000"
              placeholder="Plan Starting Date and Time"
              placeholderTextColor="#8b9cb5"
              errorMessage={timeInputError}
              blurOnSubmit={false}
              value={date.toLocaleString()}
              leftIcon={
                <Icon
                  name="calendar-outline"
                  size={24}
                  type="ionicon"
                  color="black"
                />
              }
              rightIcon={
                <Icon
                  color="black"
                  name="close"
                  size={20}
                  onPress={() => {
                    setTimeInputError("");
                    //setDate()
                    setErrorMessage("");
                  }}
                />
              }
            />
          </View>
          <View>
            <View
              style={{
                marginHorizontal: 40,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button title="Pick Date" onPress={showDatepicker} />
              <Button title="Pick Time" onPress={showTimepicker} />
            </View>
            <View style={{ marginBottom: 10 }}>
              {show ? (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="spinner"
                  onChange={onChange}
                />
              ) : null}
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            {selectedImage.localUri && selectedImage.localUri !== "" ? (
              <Image
                source={{ uri: selectedImage.localUri }}
                style={{ width: 400, height: 200 }}
                PlaceholderContent={
                  <Icon
                    name="add-circle-outline"
                    type="ionicon"
                    size={100}
                    color="grey"
                  />
                }
                onPress={openImagePickerAsync}
              />
            ) : (
              <Image
                style={{ width: 400, height: 200 }}
                PlaceholderContent={
                  <Icon
                    name="add-circle-outline"
                    type="ionicon"
                    size={100}
                    color="grey"
                  />
                }
                onPress={openImagePickerAsync}
              />
            )}
          </View>
          <Divider style={{ marginVertical: 5, backgroundColor: "black" }} />
          <View>
            <Button
              icon={<Icon name="add" size={25} color="white" />}
              buttonStyle={{ marginHorizontal: 10, borderRadius: 10 }}
              title="Add Places"
              style={{ marginVertical: 20 }}
              onPress={() => {
                navigation.navigate("PlacePick", {
                  pickedLocationFromMap: null,
                });
              }}
            />
          </View>
          <Divider style={{ marginVertical: 5, backgroundColor: "black" }} />
          <View>
            {departureAddress && departureAddress.title ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ width: "90%" }}>
                  <TouchableOpacity>
                    <Text style={{ fontSize: 20 }}>Departure Place:</Text>
                    <ListItem>
                      <Avatar
                        size="small"
                        title={departureAddress.title[0]}
                        titleStyle={{
                          color: "black",
                          fontSize: 20,
                          fontWeight: "bold",
                        }}
                      />
                      <ListItem.Content>
                        <ListItem.Title style={styles.itemTitle}>
                          {departureAddress.address}
                        </ListItem.Title>
                        <ListItem.Subtitle>
                          {departureAddress.title}
                        </ListItem.Subtitle>
                      </ListItem.Content>
                    </ListItem>
                    <Divider
                      style={{ marginVertical: 5, backgroundColor: "black" }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ marginRight: 35, width: 30, height: 30 }}>
                  <Icon
                    name="delete"
                    type="antdesign"
                    onPress={() => {
                      dispatch(removeDeparturPlace());
                      console.log("delete clicked");
                    }}
                  />
                </View>
              </View>
            ) : null}
          </View>

          <View>
            <Text style={{ fontSize: 20 }}>Destination Places:</Text>
            {destinationAddress && destinationAddress.length !== 0
              ? destinationAddress.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ width: "90%" }}>
                        <TouchableOpacity
                          onPress={() => {
                            console.log("navigation clicked");
                            const pickedLocation = {
                              lat: item.lat,
                              lng: item.lng,
                            };
                            navigation.navigate("Map", {
                              initialLocation: pickedLocation,
                            });
                          }}
                        >
                          <ListItem>
                            <Avatar
                              // avatarStyle={{ borderRadius: 10 }}
                              size="small"
                              title={item.title[0]}
                              titleStyle={{
                                color: "black",
                                fontSize: 20,
                                fontWeight: "bold",
                              }}
                            />

                            <ListItem.Content>
                              <ListItem.Title style={styles.itemTitle}>
                                {item.address}
                              </ListItem.Title>
                              <ListItem.Subtitle>
                                {item.title}
                              </ListItem.Subtitle>
                            </ListItem.Content>
                          </ListItem>
                          <Divider
                            style={{
                              marginVertical: 5,
                              backgroundColor: "black",
                            }}
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={{ marginRight: 35, width: 30, height: 30 }}>
                        <Icon
                          name="delete"
                          type="antdesign"
                          onPress={() => {
                            dispatch(removeDestinationPlace(item.placeId));
                            console.log("delete clicked :");
                            console.log(item.placeId);
                          }}
                        />
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  title: {
    color: "#FFFFFF",
    fontSize: 25,
    paddingTop: 15,
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,

    margin: 6,
    marginLeft: 35,
    marginRight: 35,
  },
  buttonStyle: {
    backgroundColor: "#307016",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#307016",
    height: 40,
    alignItems: "center",
    borderRadius: 20,
    marginTop: 30,
    marginLeft: 35,
    marginRight: 35,

    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
});
export default CreateNewPlanScreen;
