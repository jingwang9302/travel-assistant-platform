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
  ScrollView,
  RefreshControl,
  ImageBackground,
  Alert,
} from "react-native";

import {
  USER_SERVICE,
  GROUP_SERVICE,
  GROUP_BASE_URL,
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
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";

import { USER_DATA, GROUP_DATA } from "./Data";
import LoginAlertScreen from "../user/LoginAlertScreen";
import Loader from "../../components/Loader";
import {
  setGroupsUserIn,
  setCurrentGroup,
  clearCurrGroup,
  clearTravelgroup,
  UPDATE_GROUP,
  SET_CURRENTGROUP,
} from "../../redux/actions/travelgroupAction";
import { user } from "../../redux/reducers/user";
import { ForceTouchGestureHandler } from "react-native-gesture-handler";
//import { ScrollView } from "react-native-gesture-handler";

const GroupDetailScreen = ({ navigation, route }) => {
  //const [groupMembers, setGroupMembers] = useState([]);
  const [notation, setNotation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userNotInGroup, setUserNotInGroup] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState({
    groupImage: "",
    groupMembers: [],
    groupManagers: [],
    travelPlans: [],
    status: 1,
    _id: "",
    groupOwner: 0,
    groupName: "",
  });

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { groups } = useSelector((state) => state.groups);

  const userProfile = useSelector((state) => state.user);
  const { groupId } = route.params;

  const [allPeopleInGroup, setAllPeopleInGroup] = useState([]);
  const [all, setAll] = useState([]);
  const [currUserRole, setCurrUserRole] = useState("");
  const [buttonDisplay, setButtonDisplay] = useState([]);
  //const [isOwner, setIsOwner] = useState(false);
  const [isGroupOwner, setIsGroupOwner] = useState(false);

  // console.log(`groupId is passed: ${groupId}`);
  // console.log("loading is: ");
  // console.log(loading);
  let groupSelected;
  const allInGroup = [];

  const leaveGroup = () => {
    axios({
      method: "DELETE",
      url:
        GROUP_SERVICE +
        `delete/${groupSelected.groupOwner}/${groupId}/${userProfile.id}`,
    })
      .then((res) => {
        navigation.navigate("GroupList");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Failed", error.response.data.error);
      });
  };

  const deleteGroup = () => {
    axios({
      method: "DELETE",
      url: GROUP_SERVICE + `update/close/${userProfile.id}/${groupId}`,
    })
      .then((res) => {
        navigation.navigate("GroupList");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Failed", error.response.data.error);
      });
  };
  const buttonList = [
    {
      show: true,
      name: "Add Memmbers",
      onPress: () => {
        navigation.navigate("UserSearch", {
          groupId,
          foraddrole: "addmember",
          group: groupSelected,
        });
      },
    },
    {
      show: true,
      name: "Add Managers",
      onPress: () => {
        navigation.navigate("UserSearch", {
          groupId,
          foraddrole: "addmanager",
          group: groupSelected,
        });
      },
    },
    {
      show: true,
      name: "Leave Group",
      onPress: () => {
        Alert.alert("Alert", "Are sure to leave this group?", [
          {
            text: "Cancel",
            onPress: () => {
              console.log("Leave group is cancelled");
            },
            style: "cancel",
          },
          {
            text: "Ok",
            onPress: () => {
              leaveGroup();
            },
          },
        ]);
      },
    },
    {
      show: true,
      name: "Delete Group",
      onPress: () => {
        Alert.alert("Alert", "Are sure to delete this group?", [
          {
            text: "Cancel",
            onPress: () => {
              console.log("Delete group is cancelled");
            },
            style: "cancel",
          },
          {
            text: "Ok",
            onPress: () => {
              deleteGroup();
            },
          },
        ]);
      },
    },
  ];

  useEffect(() => {
    if (userProfile.isLogin) {
      //setLoading(true);
      fetchSingleGroup();
    }
  }, []);

  React.useLayoutEffect(() => {
    if (isGroupOwner) {
      navigation.setOptions({
        headerRight: () => (
          <HeaderButtons>
            <Item
              style={{ marginRight: 15, justifyContent: "center" }}
              title="Edit"
              onPress={() => {
                navigation.navigate("GroupEdit", {
                  ...selectedGroup,
                });
              }}
            />
          </HeaderButtons>
        ),
      });
    }
  }, [selectedGroup]);

  if (!userProfile.isLogin) {
    return <LoginAlertScreen />;
  }

  const fetchUserInfo = (userId, userRole) => {
    axios({
      method: "get",
      url: USER_SERVICE + "/profile/basic/" + userId,
      headers: {
        Authorization: "Bearer " + userProfile.token,
      },
    })
      .then(function (response) {
        //need to check API
        const basicUserInfo = { ...response.data, role: userRole };
        console.log("basic user info:");
        console.log(basicUserInfo);
        allInGroup.push(basicUserInfo);
        console.log("allin Gorup:");
        console.log(allInGroup);
        setAllPeopleInGroup((oldarr) => [...oldarr, basicUserInfo]);
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

  const joinGroup = () => {
    axios({
      method: "PUT",
      url:
        GROUP_SERVICE +
        `update/addmember/${selectedGroup.groupOwner}/${groupId}/${userProfile.id}`,
    })
      .then((res) => {
        Alert.alert(
          "Successful",
          "You successfully join this group. Please refresh!"
        );
      })
      .catch((error) => {
        Alert.alert("Error", error.response.data);
      });
  };

  // const addUserToGroup = (idToAdd) => {
  //   axios({
  //     method: "PUT",
  //     url:
  //       GROUP_SERVICE +
  //       `update/${foraddrole}/${userProfile.id}/${groupId}/${idToAdd}`,
  //   })
  //     .then((res) => {
  //       Alert.alert("Successful");
  //       navigation.goBack();
  //     })
  //     .catch((error) => {
  //       console.log(error.response.data.error);
  //       Alert.alert(error.response.data.error);
  //     });
  // };
  // const getFriend = () => {
  //   axios({
  //     method: "get",
  //     url: USER_SERVICE + "/friends/" + userProfile.id,
  //     headers: {
  //       Authorization: "Bearer " + userProfile.token,
  //     },
  //   })
  //     .then(function (response) {
  //       setFriends(response.data);
  //     })
  //     .catch(function (error) {
  //       console.log(error.response);
  //     });
  // };

  // const fetchUserInfo = (token) => {
  //   axios({
  //     method: "get",
  //     url: USER_SERVICE + "/profile/" + username,
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //   })
  //     .then(function (response) {
  //       dispatch(setProfile(response.data));
  //       getNotifications(token, response.data.id);
  //       getUserAvatar(token, response.data.id);
  //       dispatch(setLogin(true));
  //     })
  //     .catch(function (error) {
  //       console.log(error.response);
  //     });
  // };

  const fetchSingleGroup = () => {
    setAllPeopleInGroup([]);
    setErrorMessage("");
    setIsRefreshing(true);
    axios
      .get(GROUP_SERVICE + "read/" + groupId)
      .then(function (res) {
        const { data } = res.data;
        console.log("feched group:");
        console.log(data);
        loadSingleGroup(data);
        groupSelected = data;
        setSelectedGroup(data);
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error);
        console.log(errorMessage);
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  const loadSingleGroup = (group) => {
    console.log("enter loadingsingle group");
    if (group) {
      console.log(group);
      let isMember = false;
      let isManager = false;
      let isOwner = false;

      const groupMembers = group.groupMembers;
      console.log("members:");
      console.log(groupMembers);
      if (groupMembers && groupMembers.length !== 0) {
        if (groupMembers.includes(userProfile.id)) {
          setUserNotInGroup(false);
          isMember = true;
          setButtonDisplay([buttonList[0], buttonList[2]]);
          setCurrUserRole("member");
          setNotation("You are a member of this group");
        }

        groupMembers.forEach((id) => {
          fetchUserInfo(id, "member");
        });
      }

      //get usrIds in groupManagers
      const groupManagers = group.groupManagers;
      if (groupManagers && groupManagers.length !== 0) {
        if (groupManagers.includes(userProfile.id)) {
          //setIsManager(true);
          setUserNotInGroup(false);
          isManager = true;
          setButtonDisplay([buttonList[0], buttonList[2]]);

          //setCurrUserRole("manager");
          setCurrUserRole("manager");
          setNotation("You are the manager of this group");
          // notation = "You are the manager of this group";
        }

        groupManagers.forEach((id) => {
          fetchUserInfo(id, "manager");
        });
      }

      console.log("managers:");
      console.log(groupManagers);
      //get groupOwner id
      const groupOwner = group.groupOwner;

      console.log("groupowner:");
      console.log(groupOwner);

      if (groupOwner === userProfile.id) {
        setIsGroupOwner(true);
        setUserNotInGroup(false);
        isOwner = true;
        setButtonDisplay([buttonList[0], buttonList[1], buttonList[3]]);
        setCurrUserRole("owner");
        //currUserRole = "owner";

        setNotation("You are the owner of this group");
        console.log("your are owner");
        //notation = "You are the owner of this group";
      }

      if (!isOwner && !isManager && !isMember) {
        setNotation("You are not in this group");
        setUserNotInGroup(true);
        return;
      }

      if (!isOwner) {
        fetchUserInfo(groupOwner, "owner");

        // let owner = USER_DATA.filter((user) => user.id === groupOwner)[0];
        // owner = { ...owner, role: "owner" };

        // setAllPeopleInGroup((old) => [...old, owner]);
        //allPeopleInGroup.push({ ...owner, role: "owner" });
      } else {
        setNotation("You are the owner of this group");
        fetchUserInfo(userProfile.id, "owner");
        // const owner = { ...userProfile, role: "owner" };
        // setAllPeopleInGroup((old) => [...old, owner]);
      }

      // if (groupManagers && groupManagers.length !== 0) {
      //   groupManagers.forEach((item) => {
      //     // if (item !== userProfile.id) {
      //     //   fetchUserInfo(item, "manager");
      //     // }
      //     fetchUserInfo(item, "manager");
      //     console.log("After Fetch Manager");
      //     console.log(allPeopleInGroup);

      //     //for test
      //     //console.log(item);
      //     // const manager = USER_DATA.filter((user) => user.id === item)[0];
      //     // console.log("manager is:");
      //     // console.log(manager);
      //     // setAllPeopleInGroup((old) => [
      //     //   ...old,
      //     //   { ...manager, role: "manager" },
      //     // ]);
      //     // console.log("Fetchc Manager");
      //     // console.log(allPeopleInGroup);

      //     //allPeopleInGroup.push({ ...manager, role: "manager" });
      //   });
      // }

      // if (groupMembers && groupMembers.length !== 0) {
      //   //fectch memebrs' info
      //   groupMembers.forEach((item) => {
      //     fetchUserInfo(item, "member");

      //     //for test only
      //     // let member = USER_DATA.filter((user) => user.id === item)[0];
      //     // member = { ...member, role: "member" };

      //     // // console.log("members is");
      //     // // console.log(member);
      //     // setAllPeopleInGroup((old) => [...old, member]);

      //     //allPeopleInGroup.push({ ...member, role: "member" });
      //   });

      //   console.log("all members in group:");
      //   console.log(allPeopleInGroup);
      // }
    }
  };

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ borderBottomColor: "black" }}
      onPress={() =>
        navigation.navigate("GroupManage", {
          selectedUserDetail: item,
          currUserRole: currUserRole,
          groupId,
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
        {item.avatarUrl && item.avatarUrl !== "" ? (
          <Avatar
            rounded
            source={{
              uri: UPLOAD_IMAGE_URL + item.avatarUrl,
            }}
            size="large"
          />
        ) : (
          <Avatar rounded title={item.firstName} size="large" />
        )}

        {item.role !== "member" ? (
          <Badge
            value={item.role}
            status="success"
            containerStyle={{ position: "absolute", top: 0, right: 0 }}
          />
        ) : null}
        <Text>{item.firstName}</Text>
      </View>
    </TouchableOpacity>
  );
  if (userNotInGroup) {
    {
      listHeader;
    }
  }

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
              uri: `${GCS_URL}${selectedGroup.groupImage}`,
            }}
            style={{
              height: 200,
              justifyContent: "center",
              resizeMode: "contain",
            }}
          >
            <View style={{ marginTop: 80 }}>
              <View>
                <Text style={styles.text}>{selectedGroup.groupName}</Text>
              </View>
              <View>
                <Text
                  style={{ color: "white", fontSize: 23, fontWeight: "bold" }}
                >
                  GroupID: {selectedGroup._id}
                </Text>
              </View>

              <View>
                <Text
                  style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
                >
                  Created at:{selectedGroup.createdAt}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 40,
          }}
        >
          <Text style={{ fontSize: 22, color: "black", fontWeight: "bold" }}>
            {notation}
          </Text>
          <View style={{ marginTop: 5, marginRight: 5 }}>
            {userNotInGroup ? (
              <Button
                //contentContainerStyle={{ fontSize: 14 }}
                titleStyle={{ fontSize: 14 }}
                size={20}
                title="Join Group"
                onPress={joinGroup}
              />
            ) : null}
          </View>
        </View>
        <Divider style={{ marginVertical: 10, backgroundColor: "black" }} />

        <View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PlanList", {
                groupId: groupId,
              })
            }
          >
            <View
              style={{
                height: 40,
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 30, fontWeight: "bold" }}>Travels </Text>
              <Text style={{ fontSize: 20 }}>more{" >>   "}</Text>
            </View>
          </TouchableOpacity>
          <Divider style={{ margin: 5, backgroundColor: "black" }} />
        </View>
      </SafeAreaView>
    );
  };

  const listFooter = () => {
    return (
      <View style={styles.buttonContainer}>
        <Divider style={{ margin: 20, backgroundColor: "black" }} />
        {buttonDisplay.length !== 0
          ? buttonDisplay.map((item, index) => {
              return (
                <View key={index}>
                  <Button
                    buttonStyle={{ marginHorizontal: 10, borderRadius: 10 }}
                    title={item.name}
                    style={{ marginVertical: 5 }}
                    onPress={item.onPress}
                  />
                </View>
              );
            })
          : null}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Loader loading={loading} />
      {allPeopleInGroup && allPeopleInGroup.length !== 0 ? (
        <FlatList
          contentContainerStyle={{ alignContent: "space-between" }}
          style={{ backgroundColor: "white" }}
          onRefresh={fetchSingleGroup}
          refreshing={isRefreshing}
          numColumns={5}
          data={allPeopleInGroup}
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

    fontSize: 30,
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
  text: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "left",
  },
});

export default GroupDetailScreen;
