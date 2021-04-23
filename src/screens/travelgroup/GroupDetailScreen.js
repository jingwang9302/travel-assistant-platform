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
  ActivityIndicator,
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
import {
  setGroupsUserIn,
  setCurrentGroup,
  clearCurrGroup,
  clearTravelgroup,
  UPDATE_GROUP,
  SET_CURRENTGROUP,
} from "../../redux/actions/travelgroupAction";

import LoginAlertScreen from "../user/LoginAlertScreen";
import Loader from "../../components/Loader";
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
    groupDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { groups } = useSelector((state) => state.groups);

  const userProfile = useSelector((state) => state.user);
  const { groupId } = route.params;

  const [allPeopleInGroup, setAllPeopleInGroup] = useState([]);
  const [currUserRole, setCurrUserRole] = useState("");
  const [buttonDisplay, setButtonDisplay] = useState([]);
  const [isGroupOwner, setIsGroupOwner] = useState(false);
  const dispatch = useDispatch();

  let groupSelected;
  const allInGroup = [];
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
      setLoading(true);
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

  const fetchGroups = () => {
    axios({
      method: "get",
      url: GROUP_SERVICE + "read/groups_in/" + userProfile.id,
    })
      .then(function (res) {
        const { data } = res.data;
        dispatch(setGroupsUserIn(data));
        navigation.goBack();
      })
      .catch(function (error) {
        console.log(error.response.data.error);
        if (error.response.status === 404) {
          dispatch(setGroupsUserIn([]));
          navigation.goBack();
        } else {
          Alert.alert("Alert", error.response.data.error);
        }
      });
  };

  const leaveGroup = () => {
    axios({
      method: "DELETE",
      url:
        GROUP_SERVICE +
        `delete/${groupSelected.groupOwner}/${groupId}/${userProfile.id}`,
    })
      .then((res) => {
        fetchGroups();
        //navigation.navigate("GroupList");
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
        fetchGroups();
        //navigation.navigate("GroupList");
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert("Failed", error.response.data.error);
      });
  };

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
        // console.log("basic user info:");
        // console.log(basicUserInfo);
        //allInGroup.push(basicUserInfo);
        // console.log("allin Gorup:");
        // console.log(allInGroup);
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
        fetchGroups();
      })
      .catch((error) => {
        Alert.alert("Alert", error.response.data.error);
      });
  };

  const fetchSingleGroup = () => {
    setAllPeopleInGroup([]);
    setErrorMessage("");
    setIsRefreshing(true);
    axios
      .get(GROUP_SERVICE + "read/" + groupId)
      .then(function (res) {
        const { data } = res.data;
        //console.log("feched group:");
        //console.log(data);
        loadSingleGroup(data);
        groupSelected = data;
        setSelectedGroup(data);
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data.error);
        // console.log(errorMessage);
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

          setCurrUserRole("manager");
          setNotation("You are the manager of this group");
        }

        groupManagers.forEach((id) => {
          fetchUserInfo(id, "manager");
        });
      }

      const groupOwner = group.groupOwner;

      if (groupOwner === userProfile.id) {
        setIsGroupOwner(true);
        setUserNotInGroup(false);
        isOwner = true;
        setButtonDisplay([buttonList[0], buttonList[1], buttonList[3]]);
        setCurrUserRole("owner");

        setNotation("You are the owner of this group");
      }

      if (!isOwner && !isManager && !isMember) {
        setNotation("You are not in this group");
        setUserNotInGroup(true);
      }

      if (!isOwner) {
        fetchUserInfo(groupOwner, "owner");
      } else {
        setNotation("You are the owner of this group");
        fetchUserInfo(userProfile.id, "owner");
      }
    }
  };

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
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
        size="large"
        renderPlaceholderContent={<ActivityIndicator />}
        onPress={() =>
          navigation.navigate("GroupManage", {
            selectedUserDetail: item,
            currUserRole: currUserRole,
            groupId,
          })
        }
      />

      {item.role !== "member" ? (
        <Badge
          value={item.role}
          status="success"
          containerStyle={{ position: "absolute", top: 0, right: 0 }}
        />
      ) : null}
      <Text>{item.firstName}</Text>
    </View>
  );

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
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.text}>{selectedGroup.groupName}</Text>
              {selectedGroup.groupDescription ? (
                <Text style={{ fontSize: 20, color: "white" }}>
                  {selectedGroup.groupDescription}
                </Text>
              ) : null}
            </View>
          </ImageBackground>
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 20 }}>Group Members:</Text>
        </View>
      </SafeAreaView>
    );
  };

  const listFooter = () => {
    return (
      <View style={styles.buttonContainer}>
        <Divider style={{ marginBottom: 10, backgroundColor: "black" }} />
        <Button
          buttonStyle={{ borderRadius: 10, backgroundColor: "green" }}
          title="Group Travels"
          style={{ marginVertical: 5 }}
          onPress={() =>
            navigation.navigate("PlanList", {
              groupId: groupId,
            })
          }
        />
        {buttonDisplay.length !== 0
          ? buttonDisplay.map((item, index) => {
              return (
                <View key={index}>
                  <Button
                    buttonStyle={{ borderRadius: 10 }}
                    title={item.name}
                    style={{ marginVertical: 5 }}
                    onPress={item.onPress}
                  />
                </View>
              );
            })
          : null}
        {userNotInGroup ? (
          <Button
            buttonStyle={{ borderRadius: 10 }}
            style={{ marginVertical: 5 }}
            title="Join Group"
            onPress={joinGroup}
          />
        ) : null}
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
    marginHorizontal: 15,

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
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
    //backgroundColor: "skyblue",
  },
});

export default GroupDetailScreen;
