import React, { createRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  setDepartureAndDestination,
  setOngoingPlan,
  removeOngoingPlan,
  clearDepartureAndDestinationAddress,
} from "../../redux/actions/travelPlanAction";

import {
  USER_SERVICE,
  GROUP_SERVICE,
  PLAN_SERVICE,
  PLAN_BASE_URL,
  UPLOAD_IMAGE_URL,
  GCS_URL,
} from "../../config/urls";
import {
  Icon,
  Input,
  Button,
  ListItem,
  Avatar,
  Badge,
  SearchBar,
  Divider,
} from "react-native-elements";
import { useIsFocused } from "@react-navigation/native";

import LoginAlertScreen from "../user/LoginAlertScreen";
//import { ScrollView } from "react-native-gesture-handler";

import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const PlanDetailScreen = ({ navigation, route }) => {
  const [selectedPlan, setSelectedPlan] = useState({
    planName: "",
    planDescription: "",
    image: "",
    likes: [],
    dislikes: [],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [allUserInPlan, setAllUserInPlan] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [depature, setDeparture] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isUserInPlan, setIsUserInPlan] = useState(false);
  const [positionSharing, setPositionSharing] = useState(false);
  const [notation, setNotation] = useState("");

  const planStatus = ["Created", "Published", "Ongoing", "Ended"];
  const userProfile = useSelector((state) => state.user);

  const { planId } = route.params;
  const { ongoingPlan } = useSelector((state) => state.plans);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (userProfile.isLogin) {
      if (planId && isFocused) {
        fechSinglePlan();
        Location.hasStartedLocationUpdatesAsync("UpdateLocation")
          .then((res) => {
            if (res) {
              setPositionSharing(true);
            } else {
              setPositionSharing(false);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      navigation.navigate("PlanListUserIn");
    }
  }, [planId, userProfile.isLogin, isFocused]);

  React.useLayoutEffect(() => {
    if (userProfile.id === selectedPlan.initiator) {
      navigation.setOptions({
        headerRight: () => (
          <HeaderButtons>
            {selectedPlan.status !== 3 && selectedPlan.status !== 2 ? (
              <Item
                style={{ marginRight: 15, justifyContent: "center" }}
                title="Edit"
                onPress={() => {
                  dispatch(setDepartureAndDestination({ ...selectedPlan }));
                  navigation.navigate("PlanEdit", {
                    oldPlanId: selectedPlan._id,
                    oldPlanName: selectedPlan.planName,
                    oldPlanDescription: selectedPlan.planDescription,
                    oldStartDate: selectedPlan.startDate,
                    oldImage: selectedPlan.image,
                  });
                }}
              />
            ) : null}
            <OverflowMenu
              style={{ marginRight: 10 }}
              OverflowIcon={() => (
                <Icon name="more-horizontal" type="feather" size={30} />
              )}
            >
              {selectedPlan.status === 0 ? (
                <HiddenItem
                  title="Publish Plan To Group"
                  onPress={() => {
                    navigation.navigate("PlanPublish", {
                      planId: selectedPlan._id,
                    });
                  }}
                />
              ) : null}
              {selectedPlan.status === 1 && !ongoingPlan ? (
                <HiddenItem
                  title="Start Travel"
                  onPress={() => {
                    initiatorStartPlan();
                    //dispatch(setOngoingPlan(selectedPlan));
                  }}
                />
              ) : null}
              {selectedPlan.status === 2 ? (
                <HiddenItem
                  title="End Travel"
                  onPress={() => {
                    endPlan();
                    //dispatch(removeOngoingPlan());
                  }}
                />
              ) : null}
              {selectedPlan.status === 0 || selectedPlan.status === 1 ? (
                <HiddenItem title="Delete Plan" onPress={deletePlan} />
              ) : null}
            </OverflowMenu>
          </HeaderButtons>
        ),
      });
    } else if (selectedPlan.status !== 3) {
      navigation.setOptions({
        headerRight: () => (
          <HeaderButtons>
            <OverflowMenu
              style={{ marginRight: 10 }}
              OverflowIcon={() => (
                <Icon name="more-horizontal" type="feather" size={30} />
              )}
            >
              {isUserInPlan && selectedPlan.status === 2 && !ongoingPlan ? (
                <HiddenItem
                  title="Start Travel"
                  onPress={() => {
                    participantStartPlan();
                  }}
                />
              ) : null}
              {isUserInPlan ? (
                <HiddenItem
                  title="Quit Travel"
                  onPress={() => {
                    quitPlan();
                    //dispatch(removeOngoingPlan());
                  }}
                />
              ) : (
                <HiddenItem title="Join Travel" onPress={joinPlan} />
              )}
            </OverflowMenu>
          </HeaderButtons>
        ),
      });
    }
  }, [selectedPlan, isUserInPlan, positionSharing, ongoingPlan, notation]);

  if (!userProfile.isLogin) {
    return <LoginAlertScreen />;
  }
  const isUserInThisPlan = (plan) => {
    if (userProfile.id === plan.initiator) {
      //console.log("You are the initiator of this plan");
      //setNotation("You are the initiator of this plan");
      return;
    }
    if (plan.travelMembers && plan.travelMembers.length !== 0) {
      if (plan.travelMembers.includes(userProfile.id)) {
        setIsUserInPlan(true);

        return;
      }
    }
    setIsUserInPlan(false);
  };

  const fechUserInfo = (userId) => {
    axios({
      method: "get",
      url: USER_SERVICE + "/profile/basic/" + userId,
      headers: {
        Authorization: "Bearer " + userProfile.token,
      },
    })
      .then(function (response) {
        //need to check API
        const basicUserInfo = { ...response.data };

        setAllUserInPlan((oldarr) => [...oldarr, basicUserInfo]);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data);
        console.log(error.response.data);
      });
  };

  const loadTravelMembers = (travelMembers, initiator) => {
    if (travelMembers && travelMembers.length !== 0) {
      console.log("travel members are:");
      console.log(travelMembers);
      //travelMembers.push(selectedPlan)
      travelMembers.forEach((id) => {
        //console.log(`id is ${id}`);
        fechUserInfo(id);
      });
    }
    fechUserInfo(initiator);
  };

  const fechSinglePlan = () => {
    setIsRefreshing(true);
    setAllUserInPlan([]);

    console.log("single plan feched");
    axios
      .get(PLAN_SERVICE + `read/${planId}`)
      .then((res) => {
        //If plan is ended, remove ongoing plan from redux
        const { data } = res.data;
        if (data.status === 3) {
          if (ongoingPlan && ongoingPlan === planId) {
            dispatch(removeOngoingPlan());
          }
        }

        //selectedPlan.destinationAddress;
        setDestinations(data.destinationAddress);
        setDeparture(data.departureAddress);
        isUserInThisPlan(data);

        loadTravelMembers(data.travelMembers, data.initiator);

        setSelectedPlan(data);
        setIsRefreshing(false);
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Alert", error.response.data.error);
        setErrorMessage(error.response.data.error);
        setIsRefreshing(false);
      });
  };

  //not available for initiator
  const joinPlan = () => {
    selectedPlan.travelMembers.push(userProfile.id);
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `update/${userProfile.id}/${planId}`,
      data: { travelMembers: selectedPlan.travelMembers },
    })
      .then((res) => {
        const { data } = res.data;
        fechSinglePlan();
        Alert.alert("Successful", "Join the plan successfully");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Failed", error.response.data.error);
      });
  };

  //not available for initiator
  const quitPlan = () => {
    if (ongoingPlan && ongoingPlan === planId) {
      dispatch(removeOngoingPlan());
    }
    if (positionSharing) {
      //if user is in ongoing plan, stop sharing position first
      stopSharingPosition();
    }
    const newTravlMembers = selectedPlan.travelMembers.filter(
      (id) => id !== userProfile.id
    );
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `update/${userProfile.id}/${planId}`,
      data: { travelMembers: newTravlMembers },
    })
      .then((res) => {
        const { data } = res.data;
        fechSinglePlan();
        Alert.alert("Successful", "Quit the plan successfully");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Failed", error.response.data.error);
      });
  };

  //only available for initiator
  const endPlan = () => {
    if (ongoingPlan && ongoingPlan === planId) {
      dispatch(removeOngoingPlan());
    }
    if (positionSharing) {
      stopSharingPosition();
    }
    const date = new Date();
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `update/${userProfile.id}/${planId}`,
      data: { status: 3, endDate: date.toLocaleString() },
    })
      .then((res) => {
        console.log("End Plan Successfully");
        fechSinglePlan();
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Alert", error.response.data.error);
      });
  };

  const startPositionSharingAlert = () => {
    Alert.alert(
      "Position Sharing",
      "Are you sure to start sharing your postion",
      [
        {
          text: "Dismiss",
        },
        {
          text: "OK",
          onPress: () => {
            startSharingPosition();
          },
        },
      ]
    );
  };

  TaskManager.defineTask("UpdateLocation", ({ data: { locations }, error }) => {
    if (error) {
      console.log(error.message);
      return;
    }
    const pemission = verifyPermissions();
    if (pemission) {
      uploadPostion(
        locations[0].coords.latitude,
        locations[0].coords.longitude
      );
    }

    console.log("Received new locations", locations[0].coords.longitude);
  });

  // uploading user's postion to DB
  const uploadPostion = (lat, lng) => {
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `ongoing/${userProfile.id}/${planId}`,
      data: { lat, lng },
    })
      .then((res) => {
        console.log("postion is uploaded");
        console.log(`lat: ${lat}, lng: ${lng}`);
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Alert", error.response.data.error);
      });
  };

  // uploading user's postion to DB
  const startSharingPosition = async () => {
    setButtonLoading(true);
    const permission = verifyPermissions();
    let myLocation = null;
    if (permission) {
      myLocation = await Location.getCurrentPositionAsync({ accuracy: 6 });
    }

    if (myLocation) {
      axios({
        method: "POST",
        url: PLAN_SERVICE + `ongoing/${userProfile.id}/${planId}`,
        data: {
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          lat: myLocation.coords.latitude,
          lng: myLocation.coords.longitude,
        },
      })
        .then((res) => {
          console.log("create ongoing Travelplan success");
          setButtonLoading(false);
          setPositionSharing(true);
          //to check if backgroud task is already running
          Location.hasStartedLocationUpdatesAsync("UpdateLocation")
            .then((res) => {
              if (!res) {
                Location.startLocationUpdatesAsync("UpdateLocation", {
                  accuracy: Location.Accuracy.Low,
                  distanceInterval: 30,
                });
              }
              alert("Position is being shared");
            })
            .catch((error) => {
              setButtonLoading(false);
              console.log(error);
            });
        })
        .catch((error) => {
          if (error.response.status === 404) {
            Alert.alert("Alert", error.response.data.error);
          }
          setButtonLoading(false);
          console.log(error.response.data.error);
        });
    }
  };

  const stopSharingPosition = () => {
    Location.hasStartedLocationUpdatesAsync("UpdateLocation")
      .then((res) => {
        if (res) {
          Location.stopLocationUpdatesAsync("UpdateLocation");
          alert("Position Sharing is Stopped");
        }
        setPositionSharing(false);
        deleteOngoingTravelplan();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const verifyPermissions = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Alert", "Permission to access location was denied");
      return false;
    }
    return true;
  };

  const deleteOngoingTravelplan = () => {
    axios({
      method: "DELETE",
      url: PLAN_SERVICE + `ongoing/${userProfile.id}/${planId}`,
    })
      .then((res) => {
        console.log("Stop position sharing success");
      })
      .catch((error) => {
        // Alert.alert("Failed", error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  const initiatorStartPlan = () => {
    const date = new Date();
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `update/${userProfile.id}/${planId}`,
      data: { status: 2, startDate: date.toLocaleString() },
    })
      .then((res) => {
        const { data } = res.data;
        setSelectedPlan(data);
        startPositionSharingAlert();
        dispatch(setOngoingPlan(planId));
        fechSinglePlan();
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Alert", error.response.data.error);
      });
  };

  const deletePlan = () => {
    axios({
      method: "DELETE",
      url: PLAN_SERVICE + `delete/${userProfile.id}/${planId}`,
    })
      .then((res) => {
        navigation.navigate("PlanListTab", { planDelete: true });
      })
      .catch((error) => {
        Alert.alert("Failed", error.response.data.error);
      });
  };

  const participantStartPlan = () => {
    dispatch(setOngoingPlan(planId));
    fechSinglePlan();
    startPositionSharingAlert();
  };

  //const participantStartPlan = () => {};
  const likePlan = () => {
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `like/${userProfile.id}/${planId}`,
    })
      .then((res) => {
        const { data } = res.data;
        setSelectedPlan(data);
      })
      .catch((error) => {
        Alert.alert("Waring", error.response.data.message);
      });
  };

  const dislikePlan = () => {
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `dislike/${userProfile.id}/${planId}`,
    })
      .then((res) => {
        const { data } = res.data;
        setSelectedPlan(data);
      })
      .catch((error) => {
        Alert.alert("Waring", error.response.data.message);
      });
  };

  if (errorMessage) {
    return (
      <View>
        <Text style={styles.errorTextStyle}>{errorMessage}</Text>
      </View>
    );
  }
  const listHeader = () => {
    return (
      <SafeAreaView>
        <View style={{ marginBottom: 5 }}>
          <ImageBackground
            source={{
              uri: `${GCS_URL}${selectedPlan.image}`,
            }}
            style={{
              height: 200,
              justifyContent: "center",
              resizeMode: "contain",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "white", fontSize: 35, fontWeight: "bold" }}
              >
                {selectedPlan.planName}
              </Text>
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                {selectedPlan.planDescription}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View style={{ marginHorizontal: 5 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              Status: {planStatus[selectedPlan.status]}
            </Text>
            {!positionSharing && ongoingPlan === planId ? (
              <Button
                loading={buttonLoading}
                title="Start Sharing Position"
                onPress={startSharingPosition}
              />
            ) : null}
            {positionSharing && ongoingPlan === planId ? (
              <Button
                title="Stop Sharing Position"
                onPress={stopSharingPosition}
              />
            ) : null}
          </View>

          <View style={{ marginBottom: 10 }}>
            {selectedPlan.startDate ? (
              <View>
                <Text style={{ color: "black", fontSize: 20 }}>
                  Start Date: {selectedPlan.startDate}
                </Text>
              </View>
            ) : null}
            {selectedPlan.endDate ? (
              <Text style={{ color: "black", fontSize: 20 }}>
                End Date: {selectedPlan.endDate}
              </Text>
            ) : null}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            marginBottom: 2,
            marginHorizontal: 5,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View>
              <Text style={{ fontSize: 20 }}>Likes</Text>
            </View>
            <View style={{ marginLeft: 20 }}>
              <Icon
                name="thumbs-up-outline"
                type="ionicon"
                onPress={() => {
                  likePlan();
                }}
              />
              {selectedPlan.likes.length === 0 ? null : (
                <Badge
                  value={selectedPlan.likes.length}
                  status="success"
                  containerStyle={{
                    position: "absolute",
                    bottom: 5,
                    left: 25,
                  }}
                />
              )}
            </View>
          </View>

          <View style={{ flexDirection: "row", marginLeft: 160 }}>
            <View>
              <Text style={{ fontSize: 20 }}>Dislikes</Text>
            </View>
            <View style={{ marginLeft: 20 }}>
              <Icon
                name="thumbs-down-outline"
                type="ionicon"
                onPress={() => {
                  dislikePlan();
                }}
              />
              {selectedPlan.dislikes.length === 0 ? null : (
                <Badge
                  value={selectedPlan.dislikes.length}
                  status="warning"
                  containerStyle={{
                    position: "absolute",
                    bottom: 5,
                    left: 25,
                  }}
                />
              )}
            </View>
          </View>
        </View>
        <Divider style={{ marginVertical: 10, backgroundColor: "black" }} />

        <View style={{ marginVertical: 10, marginHorizontal: 5 }}>
          <Text style={{ fontSize: 20 }}>Participants:</Text>
        </View>
      </SafeAreaView>
    );
  };

  const listFooter = () => {
    return (
      <View style={{ marginHorizontal: 5, marginVertical: 10 }}>
        <View>
          {selectedPlan.status !== 0 ? (
            <Button
              buttonStyle={{ borderRadius: 5 }}
              title="To Group >>"
              titleStyle={{ fontSize: 15 }}
              onPress={() => {
                navigation.navigate("GroupDetail", {
                  groupId: selectedPlan.travelGroup,
                });
              }}
            />
          ) : null}
        </View>
        <View>
          <Divider style={{ marginVertical: 10, backgroundColor: "black" }} />
          {selectedPlan.departureAddress &&
          selectedPlan.departureAddress.title ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ width: "90%" }}>
                <Text style={{ fontSize: 20 }}>Departure Place:</Text>
                <TouchableOpacity
                  onPress={() => {
                    const pickedLocation = {
                      lat: selectedPlan.departureAddress.lat,
                      lng: selectedPlan.departureAddress.lng,
                    };
                    navigation.navigate("MapForPlacePick", {
                      title: selectedPlan.departureAddress.title,
                      readOnly: true,
                      initialLocation: pickedLocation,
                    });
                  }}
                >
                  <ListItem>
                    <Avatar
                      size="medium"
                      title={selectedPlan.departureAddress.title[0]}
                      titleStyle={{
                        color: "black",
                        fontSize: 25,
                        fontWeight: "bold",
                      }}
                    />
                    <ListItem.Content>
                      <ListItem.Title style={styles.itemTitle}>
                        {selectedPlan.departureAddress.address}
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        {selectedPlan.departureAddress.title}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                </TouchableOpacity>
                <Divider
                  style={{ marginVertical: 5, backgroundColor: "black" }}
                />
              </View>
              <View tyle={{ marginRight: 40, width: 20, height: 20 }}>
                <Icon
                  name="navigation"
                  type="feather"
                  onPress={() => {
                    navigation.navigate("Map", {
                      screen: "Navigation",
                      params: {
                        info: {
                          address: selectedPlan.departureAddress.address,
                          longitude: selectedPlan.departureAddress.lng,
                          latitude: selectedPlan.departureAddress.lat,
                        },
                      },
                    });
                  }}
                />
              </View>
            </View>
          ) : null}
        </View>

        <View>
          <Text style={{ fontSize: 20 }}>Destination Places:</Text>
          {selectedPlan.destinationAddress &&
          selectedPlan.destinationAddress.length !== 0
            ? selectedPlan.destinationAddress.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ width: "90%" }}>
                      <TouchableOpacity
                        onPress={() => {
                          const pickedLocation = {
                            lat: item.lat,
                            lng: item.lng,
                          };
                          navigation.navigate("MapForPlacePick", {
                            title: item.title,
                            readOnly: true,
                            initialLocation: pickedLocation,
                          });
                        }}
                      >
                        <ListItem>
                          <Avatar
                            // avatarStyle={{ borderRadius: 10 }}
                            size="medium"
                            title={item.title[0]}
                            titleStyle={{
                              color: "black",
                              fontSize: 25,
                              fontWeight: "bold",
                            }}
                          />
                          <ListItem.Content>
                            <ListItem.Title style={styles.itemTitle}>
                              {item.address}
                            </ListItem.Title>
                            <ListItem.Subtitle>{item.title}</ListItem.Subtitle>
                          </ListItem.Content>
                        </ListItem>
                      </TouchableOpacity>
                      <Divider
                        style={{
                          marginVertical: 5,
                          backgroundColor: "black",
                        }}
                      />
                    </View>

                    <View tyle={{ marginRight: 40, width: 20, height: 20 }}>
                      <Icon
                        name="navigation"
                        type="feather"
                        onPress={() => {
                          navigation.navigate("Map", {
                            screen: "Navigation",
                            params: {
                              info: {
                                address: item.address,
                                longitude: item.lng,
                                latitude: item.lat,
                              },
                            },
                          });
                        }}
                      />
                    </View>
                  </View>
                );
              })
            : null}
        </View>
      </View>
    );
  };
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item }) => (
    <View style={{ marginTop: 6 }}>
      <View
        style={{
          margin: 5,
          //alignContent: "stretch",
          alignItems: "center",
          borderColor: "black",
          borderRadius: 5,
          backgroundColor: "white",
        }}
      >
        <Avatar
          rounded
          title={item.firstName}
          source={{
            uri: UPLOAD_IMAGE_URL + item.avatarUrl,
          }}
          renderPlaceholderContent={<ActivityIndicator />}
          size="large"
          onPress={() =>
            navigation.navigate("GroupManage", {
              selectedUserDetail: item,
              readOnly: true,
            })
          }
        />

        <Text>{item.firstName}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {selectedPlan ? (
        <FlatList
          contentContainerStyle={{ alignContent: "space-between" }}
          style={{ backgroundColor: "white" }}
          onRefresh={fechSinglePlan}
          refreshing={isRefreshing}
          numColumns={4}
          data={allUserInPlan}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 2,
  },
  rowContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 2,
    flexDirection: "column",
    height: 10,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemTitle: {
    color: "black",
    fontWeight: "bold",
    fontSize: 17,
  },
  itemSubtitle: {
    color: "black",
  },
  touchableOpacityStyleFloating: {
    position: "absolute",
    // width: 50,
    // height: 50,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
  },
  buttonContainer: {
    backgroundColor: "white",
    marginTop: 10,

    justifyContent: "space-between",
  },
  button: {
    paddingBottom: 5,
  },
  buttonStyle: {
    backgroundColor: "steelblue",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#307016",
    height: 40,
    alignItems: "center",
    borderRadius: 20,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 5,
    marginBottom: 5,
    width: "90%",
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },

  errorTextStyle: {
    fontSize: 30,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "white",
    marginTop: 80,
    marginBottom: 120,
  },
  SectionStyle: {
    marginTop: 5,
    marginBottom: 10,
    margin: 5,
  },
});

export default PlanDetailScreen;
