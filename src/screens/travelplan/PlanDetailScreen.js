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

import { USER_SERVICE, GROUP_SERVICE, PLAN_SERVICE } from "../../config/urls";
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

  const planStatus = ["Created", "Published", "Ongoing", "Ended"];
  const COMMENTS_DATA = [
    { title: "commnt-1", text: "first comment", user: 1, date: "2021" },
  ];
  const userProfile = useSelector((state) => state.user);

  const { planId } = route.params;
  const { ongoingPlan } = useSelector((state) => state.plans);

  const dispatch = useDispatch();

  useEffect(() => {
    // only called once
    fechSinglePlan();

    // if (userProfile.isLogin) {
    //   fetchSinglePlanWithCallback();
    //   if()

    // }
  }, [positionSharing, ongoingPlan]);

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
              OverflowIcon={() => <Icon name="more" size={30} />}
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
        headerRight: () => {
          <HeaderButtons>
            <OverflowMenu
              style={{ marginRight: 10 }}
              OverflowIcon={() => <Icon name="more" size={30} />}
            >
              {isUserInPlan && selectedPlan.status === 2 && !ongoingPlan ? (
                <HiddenItem
                  title="Start Travel"
                  onPress={() => {
                    startPositionSharingAlert();
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
          </HeaderButtons>;
        },
      });
    }
    <HiddenItem
      title="Stop Position Sharing"
      onPress={() => {
        setPositionSharing(false);
      }}
    />;
  }, [selectedPlan, isUserInPlan, positionSharing, ongoingPlan]);

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

  const fechUserInfo = (userId) => {
    const user = USER_DATA.filter((item) => item.id === userId)[0];
    console.log("feched user is");
    console.log(user);
    setAllUserInPlan((old) => [...old, user]);
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
    axios
      .get(PLAN_SERVICE + `read/${planId}`)
      .then((res) => {
        const { data } = res.data;

        console.log("plans fetched");
        console.log(data);
        //plan is ended remove ongoing plan from redux
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
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `update/${userProfile.id}/${planId}`,
      data: { status: 3, endDate: Date.now() },
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
          onPress: () => {
            setPositionSharing(false);
          },
        },
        {
          text: "OK",
          onPress: () => {
            setPositionSharing(true);
          },
        },
      ]
    );
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
    setPositionSharing(true);
    const hasPermission = verifyPermissions();
    if (hasPermission) {
      Alert.alert("Position Sharing", "Position is being shared");
      try {
        await Location.watchPositionAsync(
          { distanceInterval: 100 },
          (location) => {
            uploadPostion(location.coords.latitude, location.coords.longitude);
            console.log(`location updated is: ${location.coords.latitude}`);
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const stopSharingPosition = () => {
    //unsubscribe to Location.watchPositionAsync
    //delete the existing ongoing travelplan
    setPositionSharing(false);
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
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `update/${userProfile.id}/${planId}`,
      data: { status: 2, startDate: Date.now() },
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
        <View>
          <ImageBackground
            source={{
              uri: `http://localhost:5001/uploads/${selectedPlan.image}`,
            }}
            //source={require("../travelplan/images/planimage.jpeg")}
            style={{
              height: 200,
              justifyContent: "center",
              resizeMode: "contain",
            }}
          >
            <View style={{ marginVertical: 5 }}>
              <Text
                style={{ color: "white", fontSize: 25, fontWeight: "bold" }}
              >
                {selectedPlan.planName}
              </Text>
            </View>
            <View style={{ marginVertical: 5 }}>
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                PlanID: {selectedPlan._id}
              </Text>
            </View>
            <View style={{ marginVertical: 2 }}>
              <Text
                style={{ fontSize: 15, color: "white", fontWeight: "bold" }}
              >
                Created at:{selectedPlan.createdAt}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              Status: {planStatus[selectedPlan.status]}
            </Text>
            {selectedPlan.status !== 0 ? (
              <Button
                title="To Group >>"
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
          {selectedPlan.startDate ? (
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              Start Date: {selectedPlan.startDate}
            </Text>
          ) : null}
          {selectedPlan.endDate ? (
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              End Date: {selectedPlan.endDate}
            </Text>
          ) : null}
          {selectedPlan.cancelledDate ? (
            <Text style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
              Cancelled Date: {selectedPlan.cancelledDate}
            </Text>
          ) : null}
          <Divider style={{ marginVertical: 5, backgroundColor: "black" }} />
        </View>
        <View>
          {selectedPlan.likes ? (
            <Text style={{ fontSize: 20 }}>
              Number Of likes: {selectedPlan.likes.length}
            </Text>
          ) : (
            <Text style={{ fontSize: 20 }}>Number Of likes: 0</Text>
          )}
          {selectedPlan.dislikes ? (
            <Text style={{ fontSize: 20 }}>
              Number Of dislikes: {selectedPlan.dislikes.length}
            </Text>
          ) : (
            <Text style={{ fontSize: 20 }}>Number Of dislikes: 0</Text>
          )}
        </View>
        <Divider style={{ marginVertical: 5, backgroundColor: "black" }} />
        <View>
          <Button
            title="Comments"
            // onPress
            onPress={
              () => {
                setCommentsVisible(!commentsVisible);
              }
              //
            }
          />

          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={commentsVisible}
              onRequestClose={() => {
                console.log("close modal");
              }}
            >
              <View style={styles.modalBackground}>
                <SafeAreaView style={{ marginVertical: 40 }}>
                  <ScrollView>
                    {COMMENTS_DATA && COMMENTS_DATA.length !== 0 ? (
                      COMMENTS_DATA.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              marginBottom: 15,
                              alignItems: "flex-start",
                            }}
                          >
                            <View>
                              <Text style={{ color: "black", fontSize: 20 }}>
                                {item.text}
                              </Text>
                            </View>

                            <View style={{ marginHorizontal: 10 }}>
                              <Text style={{ color: "black", fontSize: 20 }}>
                                {" "}
                                {item.user}
                              </Text>
                            </View>
                            <View style={{ marginHorizontal: 5 }}>
                              <Text style={{ color: "black" }}>
                                {item.date}
                              </Text>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <View>
                        <Text> No Comments</Text>
                      </View>
                    )}
                  </ScrollView>
                </SafeAreaView>

                <View>
                  <Button
                    title="Close"
                    onPress={() => {
                      setCommentsVisible(!commentsVisible);
                      //visible = false;
                      console.log("close is clicked, visible is");
                      //console.log(visible);
                    }}
                  />
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  const listFooter = () => {
    return (
      <View>
        <View>
          <Divider style={{ marginVertical: 5, backgroundColor: "black" }} />
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
            uri:
              "https://avatars0.githubusercontent.com/u/32242596?s=460&u=1ea285743fc4b083f95d6ee0be2e7bb8dcfc676e&v=4",
          }}
          size="large"
        />

        <Text>{item.firstName}</Text>
      </View>
    </TouchableOpacity>
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
