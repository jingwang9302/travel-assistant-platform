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
} from "react-native";

import { PLAN_SERVICE, GCS_URL } from "../../config/urls";

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
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import {
  removeDestinationPlace,
  removeDeparturPlace,
  clearDepartureAndDestinationAddress,
} from "../../redux/actions/travelPlanAction";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditPlanScreen = ({ navigation, route }) => {
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [estimatedStartTime, setEstimatedStartTime] = useState("");
  const [selectedImage, setSelectedImage] = useState({});
  const [loading, setLoading] = useState(false);
  const [
    planDescriptionInputErrorMessage,
    setPlanDescriptionInputError,
  ] = useState("");

  const [planNameInputErrorMessage, setPlanNameInputError] = useState("");
  const [startTimeInputErrorMessage, setStartTimeInputError] = useState("");
  const { departureAddress, destinationAddress } = useSelector(
    (state) => state.plans
  );

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const {
    oldPlanId,
    oldPlanName,
    oldPlanDescription,
    oldImage,
    oldStartDate,
  } = route.params;

  const userProfile = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    setPlanName(oldPlanName);
    setPlanDescription(oldPlanDescription);
    setEstimatedStartTime(oldStartDate);
    setSelectedImage({
      localUri: `${GCS_URL}${oldImage}`,
    });
  }, []);
  let oldImageUrl = `${GCS_URL}${oldImage}`;
  //console.log(`oldplanId: ${oldPlanId}`);

  const onChange = (event, selectedDate) => {
    //const date = new Date();
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setEstimatedStartTime(currentDate.toLocaleString());
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            style={{ marginRight: 15, justifyContent: "center" }}
            title="Save"
            onPress={() => {
              updatePlan();
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
    selectedImage,
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
    //urlForEdit = pickerResult.uri;
    setSelectedImage({ localUri: pickerResult.uri });
  };

  const updatePlan = () => {
    setPlanNameInputError("");
    setPlanDescriptionInputError("");
    setStartTimeInputError("");

    if (!planName) {
      setPlanNameInputError("Please enter the planName");
      return;
    }
    if (!planDescription) {
      setPlanDescriptionInputError("Please enter the description");
      return;
    }

    if (!estimatedStartTime) {
      setStartTimeInputError("Please pick date and time");
      return;
    }
    const nowDate = new Date();
    const oldDate = new Date(estimatedStartTime);

    if (oldDate < nowDate) {
      setStartTimeInputError("Please pick the valid date and time ");
      return;
    }

    if (!destinationAddress || destinationAddress.length === 0) {
      Alert.alert("Warning", "Please Pick Destination Places");
      return;
    }

    setLoading(true);

    axios({
      method: "PUT",
      url: PLAN_SERVICE + `update/${userProfile.id}/${oldPlanId}`,
      data: {
        planName,
        planDescription,
        departureAddress,
        destinationAddress,
        startDate: estimatedStartTime,
      },
    })
      .then((res) => {
        const { data } = res.data;
        console.log("new plan:");
        //clear departure and destination addresses
        dispatch(clearDepartureAndDestinationAddress());
        if (
          selectedImage.localUri &&
          selectedImage.localUri !== oldImageUrl &&
          selectedImage.localUri !== ""
        ) {
          console.log("selelected image url:");
          console.log(selectedImage.localUri);
          upLoadImage(selectedImage.localUri, oldPlanId);
        } else {
          setLoading(false);
          navigation.navigate("PlanDetail", {
            planId: oldPlanId,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Updating Failed!", error.response.data.error);
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
        setLoading(false);
        navigation.navigate("PlanDetail", {
          planId: oldPlanId,
        });
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Updating Image Failed!", error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  return (
    <ScrollView>
      <Loader loading={loading} />
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
              errorMessage={planNameInputErrorMessage}
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
                    //planDescriptionRef.current.clear();
                    setPlanDescriptionInputError("");
                    setPlanDescription("");
                  }}
                />
              }
            />
            <Input
              style={styles.inputStyle}
              onChangeText={(input) => {
                setEstimatedStartTime(input);
              }}
              underlineColorAndroid="#f000"
              placeholder="Input Travelplan StartDate and Time"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              errorMessage={startTimeInputErrorMessage}
              blurOnSubmit={false}
              value={estimatedStartTime}
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
                    setStartTimeInputError("");
                    setEstimatedStartTime("");
                  }}
                />
              }
            />
          </View>
          <View>
            <View
              style={{
                marginHorizontal: 10,
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
            <Image
              source={{ uri: selectedImage.localUri }}
              style={{ width: 400, height: 200 }}
              PlaceholderContent={<ActivityIndicator />}
              onPress={openImagePickerAsync}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <View style={{ marginVertical: 5 }}>
              <Button
                buttonStyle={{
                  marginHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: "green",
                }}
                title="Pick a photo"
                onPress={openImagePickerAsync}
              />
            </View>

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
                    <Text style={{ fontSize: 20, marginHorizontal: 10 }}>
                      Departure Place:
                    </Text>
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
                    <Divider style={{ margin: 10, backgroundColor: "black" }} />
                  </TouchableOpacity>
                </View>
                <View style={{ marginRight: 30, width: 20, height: 20 }}>
                  <Icon
                    name="delete"
                    onPress={() => {
                      dispatch(removeDeparturPlace());
                      console.log("delete clicked");
                    }}
                  />
                </View>
              </View>
            ) : null}
          </View>

          <View style={{ marginHorizontal: 10 }}>
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
                            style={{ margin: 10, backgroundColor: "black" }}
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
export default EditPlanScreen;
