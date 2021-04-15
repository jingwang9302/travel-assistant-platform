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
} from "react-native";
import {
  setDepartureAndDestination,
  setOngoingPlan,
  removeOngoingPlan,
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

import { GROUP_DATA, PlAN_DATA, USER_DATA } from "../travelgroup/Data";

import LoginAlertScreen from "../user/LoginAlertScreen";
//import { ScrollView } from "react-native-gesture-handler";
import CommentsModal from "../../components/travelgroup_and_travelplan/commentsModal";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

import * as Location from "expo-location";

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
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [isUserInPlan, setIsUserInPlan] = useState(false);
  const [positionSharing, setPositionSharing] = useState(false);
  const [notation, setNotation] = useState("");
  const [intervalObj, setIntervalObj] = useState(null);

  const planStatus = ["Created", "Published", "Ongoing", "Ended"];
  const COMMENTS_DATA = [
    { title: "commnt-1", text: "first comment", user: 1, date: "2021" },
  ];
  const userProfile = useSelector((state) => state.user);

  const { planId } = route.params;
  const { ongoingPlan } = useSelector((state) => state.plans);
  //let intervalObj = null;

  const dispatch = useDispatch();

  useEffect(() => {
    // only called once
    fechSinglePlan();

    // if (userProfile.isLogin) {
    //   fetchSinglePlanWithCallback();
    //   if()

    // }
  }, [ongoingPlan]);

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
                  dispatch(setDepartureAndDestination(selectedPlan));
                  navigation.navigate("PlanEdit", {
                    plan: selectedPlan,
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
              {selectedPlan.status === 1 ? (
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
                <HiddenItem
                  title="Delete Plan"
                  onPress={() => {
                    navigation.navigate("PlanListTab");
                  }}
                />
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
                    dispatch(setOngoingPlan(selectedPlan));
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
    // <HiddenItem
    //   title="Stop Position Sharing"
    //   onPress={() => {
    //     setPositionSharing(false);
    //   }}
    // />;
  }, [selectedPlan, isUserInPlan, positionSharing, ongoingPlan, notation]);

  if (!userProfile.isLogin) {
    return <LoginAlertScreen />;
  }
  const isUserInThisPlan = (plan) => {
    if (userProfile.id === plan.initiator) {
      setNotation("You are the initiator of this plan");
      return;
    }
    if (plan.travelMembers && plan.travelMembers.length !== 0) {
      if (plan.travelMembers.includes(userProfile.id)) {
        setIsUserInPlan(true);
        setNotation("You have joined this plan");
        return;
      }
    }
    setNotation("You are not in this plan");
  };

  // const fechUserInfo = (userId) => {
  //   const user = USER_DATA.filter((item) => item.id === userId)[0];
  //   console.log("feched user is");
  //   console.log(user);
  //   setAllUserInPlan((old) => [...old, user]);
  // };

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
        console.log("basic user info:");
        console.log(basicUserInfo);
        // allInGroup.push(basicUserInfo);
        //console.log("allin Gorup:");
        //console.log(allInGroup);
        setAllUserInPlan((oldarr) => [...oldarr, basicUserInfo]);
        // setAll([..all, basicUserInfo]);

        // setAllPeopleInGroup((old) => {
        //   [...old, basicUserInfo];
        // });
      })
      .catch(function (error) {
        setErrorMessage(error.response.data);
        console.log(error.response.data);
      });
  };

  const loadTravelMembers = (travelMembers) => {
    if (travelMembers && travelMembers.length !== 0) {
      console.log("travel members are:");
      console.log(travelMembers);
      travelMembers.forEach((id) => {
        console.log(`id is ${id}`);
        fechUserInfo(id);
      });
    }
  };

  const fechSinglePlan = () => {
    setIsRefreshing(true);
    setAllUserInPlan([]);
    console.log(`Plan Id is ${planId}`);
    axios
      .get(PLAN_SERVICE + `read/${planId}`)
      .then((res) => {
        //plan is ended remove ongoing plan from redux
        const { data } = res.data;
        if (data.status === 3) {
          dispatch(removeOngoingPlan());
        }
        //selectedPlan.destinationAddress;
        setDestinations(data.destinationAddress);
        setDeparture(data.departureAddress);
        isUserInThisPlan(data);
        loadTravelMembers(data.travelMembers);

        setSelectedPlan(data);
        setIsRefreshing(false);
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Failed", error.response.data.error);
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
        setSelectedPlan(data);
        Alert.alert("Successful", "Join the plan successfully");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Failed", error.response.data.error);
      });
  };

  //not available for initiator
  const quitPlan = () => {
    if (ongoingPlan) {
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
        setSelectedPlan(data);
        Alert.alert("Successful", "Quit the plan successfully");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Failed", error.response.data.error);
      });
  };

  //only available for initiator
  const endPlan = () => {
    if (ongoingPlan) {
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
        dispatch(removeOngoingPlan());
        deleteOngoingTravelplan();
        Alert.alert("Successful", "End the plan successfully");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Failed", error.response.data.error);
      });
  };

  const startPositionSharingAlert = () => {
    Alert.alert(
      "Position Sharing",
      "Are you sure to start sharing your postion",
      [
        {
          text: "Cancel",
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

  const fechPositionAndUpload = async (sharePosition) => {
    if (sharePosition) {
      const hasPermission = verifyPermissions();

      if (hasPermission) {
        // const interval = setInterval(async () => {
        //   let location = await Location.getCurrentPositionAsync({});
        //   uploadPostion(location.coords.latitude, location.coords.longitude);
        //   console.log("Location is feched");
        //   console.log(location.coords.latitude);
        // }, 60000);
        // setIntervalObj(interval);
        // console.log(" start interValObj");
        // console.log(intervalObj);
      }
    } else {
      console.log(" clear interValObj");
      console.log(intervalObj);
      clearInterval(intervalObj);
      setIntervalObj(null);
      //intervalObj = null;
    }
  };

  // uploading user's postion to DB
  const uploadPostion = (lat, lng) => {
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `ongoing/${userProfile.id}/${planId}`,
      data: { lat, lng },
    })
      .then((res) => {
        console.log("postion is uploaded");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Postion Uploading Failed", error.response.data.error);
      });
  };

  // uploading user's postion to DB
  const startSharingPosition = async () => {
    axios({
      method: "POST",
      url: PLAN_SERVICE + `ongoing/${userProfile.id}/${planId}`,
    })
      .then((res) => {
        console.log("create ongoing Travelplan success");
        setPositionSharing(true);
        fechPositionAndUpload(true);
      })
      .catch((error) => {
        Alert.alert("Failed", error.response.data.error);
        console.log(error.response.data.error);
      });
    // setPositionSharing(true);
  };

  const stopSharingPosition = () => {
    //unsubscribe to Location.watchPositionAsync
    //delete the existing ongoing travelplan
    setPositionSharing(false);
    fechPositionAndUpload(false);
    // console.log("before clear");
    // console.log(intervalObj);
    // clearInterval(intervalObj);
    // console.log("intervalOBj");
    // console.log(intervalObj);
    deleteOngoingTravelplan();
  };

  const verifyPermissions = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Warning", "Permission to access location was denied");
      return false;
    }
    return true;
  };

  const createNewPositionSharing = () => {
    axios({
      method: "POST",
      url: PLAN_SERVICE + `position/create/${userProfile.id}/${planId}`,
    })
      .then((res) => {
        console.log("postionsharing is created");
        startPositionSharingAlert();
        // Alert.alert("Creation Successful", "You can start uploading postions");
      })
      .catch((error) => {
        Alert.alert("Failed", error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  const createOngoingTravelplan = () => {
    axios({
      method: "POST",
      url: PLAN_SERVICE + `ongoing/${userProfile.id}/${planId}`,
    })
      .then((res) => {
        console.log("create ongoing Travelplan success");
      })
      .catch((error) => {
        Alert.alert("Failed", error.response.data.error);
        console.log(error.response.data.error);
      });
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
        Alert.alert("Failed", error.response.data.error);
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
        //Alert.alert("Successful", "Start the travel successfully");
        createOngoingTravelplan();
        dispatch(setOngoingPlan(planId));
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Failed", error.response.data.error);
      });
  };

  const participantStartPlan = () => {
    dispatch(setOngoingPlan(planId));
    createOngoingTravelplan();
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
        <View style={{ marginBottom: 20 }}>
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
            <View style={{ marginTop: 60 }}>
              <View style={{ marginVertical: 5 }}>
                <Text
                  style={{ color: "white", fontSize: 25, fontWeight: "bold" }}
                >
                  {selectedPlan.planName}
                </Text>
              </View>
              <View style={{ marginVertical: 5 }}>
                <Text
                  style={{ color: "white", fontSize: 21, fontWeight: "bold" }}
                >
                  PlanID: {selectedPlan._id}
                </Text>
              </View>
              <View style={{ marginVertical: 2 }}>
                <Text
                  style={{ fontSize: 17, color: "white", fontWeight: "bold" }}
                >
                  Created at:{selectedPlan.createdAt}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",

              height: 35,
            }}
          >
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              Status: {planStatus[selectedPlan.status]}
            </Text>
            {selectedPlan.status !== 0 ? (
              <Button
                containerStyle={{ justifyContent: "center" }}
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

          <Divider style={{ margin: 10, backgroundColor: "black" }} />

          {notation ? (
            <View>
              <Text
                style={{ color: "black", fontSize: 20, fontWeight: "bold" }}
              >
                {notation}
              </Text>
              <Divider style={{ margin: 10, backgroundColor: "black" }} />
            </View>
          ) : null}

          <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
            Description:
          </Text>
          <Text style={{ color: "black", fontSize: 20 }}>
            {selectedPlan.planDescription}
          </Text>

          <View>
            {selectedPlan.startDate ? (
              <View>
                <Divider
                  style={{ marginVertical: 5, backgroundColor: "black" }}
                />
                <Text
                  style={{ color: "black", fontSize: 20, fontWeight: "bold" }}
                >
                  Start Date: {selectedPlan.startDate}
                </Text>
              </View>
            ) : null}
            {selectedPlan.endDate ? (
              <Text
                style={{ color: "black", fontSize: 20, fontWeight: "bold" }}
              >
                End Date: {selectedPlan.endDate}
              </Text>
            ) : null}
          </View>
        </View>
        <Divider style={{ marginVertical: 10, backgroundColor: "black" }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            marginBottom: 2,
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
      </SafeAreaView>
    );
  };

  const listFooter = () => {
    return (
      <View>
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
                    navigation.navigate("Map", {
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
                    Alert.alert("Alert", "Go to navigation screen");
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
                          navigation.navigate("Map", {
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
                          Alert.alert("Alert", "Go to navigation screen");
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
      <TouchableOpacity
        style={{ borderBottomColor: "black" }}
        onPress={() =>
          navigation.navigate("GroupManage", {
            selectedUserDetail: item,
            readOnly: true,
          })
        }
      >
        <View
          style={{
            flex: 1,

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
            source={{
              uri: UPLOAD_IMAGE_URL + item.avatarUrl,
            }}
            size="large"
          />

          <Text>{item.firstName}</Text>
        </View>
      </TouchableOpacity>
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
      <View style={styles.touchableOpacityStyleFloating}>
        {!positionSharing && ongoingPlan ? (
          <Button
            title="Start Sharing Position"
            onPress={startSharingPosition}
          />
        ) : null}
        {positionSharing && ongoingPlan ? (
          <Button title="Stop Sharing Position" onPress={stopSharingPosition} />
        ) : null}
      </View>
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
    width: 50,
    height: 50,
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
});

export default PlanDetailScreen;