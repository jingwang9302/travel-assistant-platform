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

import { USER_SERVICE, GROUP_SERVICE } from "../../config/urls";
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
//import { ScrollView } from "react-native-gesture-handler";

const GroupDetailScreen = ({ navigation, route }) => {
  //const [groupMembers, setGroupMembers] = useState([]);
  const [notation, setNotation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userNotInGroup, setUserNotInGroup] = useState(true);

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
  const [currUserRole, setCurrUserRole] = useState("");
  const [buttonDisplay, setButtonDisplay] = useState([]);
  //const [isOwner, setIsOwner] = useState(false);
  const [isGroupOwner, setIsGroupOwner] = useState(false);

  // console.log(`groupId is passed: ${groupId}`);
  // console.log("loading is: ");
  // console.log(loading);
  let groupSelected;

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
        leaveGroup();
      },
    },
    {
      show: true,
      name: "Delete Group",
      onPress: () => {
        deleteGroup();
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

  const fetchUserInfo = (userId, userRole) => {
    axios({
      method: "get",
      url: USER_SERVICE + "/profile/" + userId,
      headers: {
        Authorization: "Bearer " + userProfile.token,
      },
    }).then(function (response) {
      //need to check API
      setAllPeopleInGroup(
        [
          ...allPeopleInGroup,
          { name: response.data.name, role: userRole, id: userId },
        ]
        // allPeopleInGroup.push({
        //   name: response.data.name,
        //   role: userRole,
        //   id: userId,
        // });
      ).catch(function (error) {
        setErrorMessage(error.response.data);
        console.log(error.response.data);
      });
    });
  };

  const fetchUserAvatar = (userId) => {};

  const fetchSingleGroup = () => {
    setAllPeopleInGroup([]);
    setErrorMessage("");
    setIsRefreshing(true);
    //setLoading(true);
    //console.log("fetech is called");
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
        //console.log("error happend:");

        setErrorMessage(error.response.data.error);
        console.log(errorMessage);
        setLoading(false);
        setIsRefreshing(false);
      });
    //setIsRefreshing(false);
    //setLoading(false);
  };

  const loadSingleGroup = (group) => {
    console.log("enter loadingsingle group");
    if (group) {
      console.log(group);
      let isMember = false;
      let isManager = false;
      let isOwner = false;
      // let notShowAddManagerButton = true;
      // let notShowLeaveGroupButton = false;
      // let notShowDeleGroupButton = true;

      const groupMembers = group.groupMembers;
      console.log("members:");
      console.log(groupMembers);
      if (groupMembers.length !== 0) {
        if (groupMembers.includes(userProfile.id)) {
          isMember = true;
          setButtonDisplay([buttonList[0], buttonList[2]]);
          setCurrUserRole("member");
          setNotation("You are a member of this group");
        }
      }

      //get usrIds in groupManagers
      const groupManagers = group.groupManagers;
      if (groupManagers.length !== 0) {
        if (groupManagers.includes(userProfile.id)) {
          //setIsManager(true);
          isManager = true;
          setButtonDisplay([buttonList[0], buttonList[2]]);

          //setCurrUserRole("manager");
          setCurrUserRole("manager");
          setNotation("You are the manager of this group");
          // notation = "You are the manager of this group";
        }
      }

      console.log("managers:");
      console.log(groupManagers);
      //get groupOwner id
      const groupOwner = group.groupOwner;

      console.log("groupowner:");
      console.log(groupOwner);

      if (groupOwner === userProfile.id) {
        setIsGroupOwner(true);
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
        //fetchUserInfo(groupOwner, "owner");

        let owner = USER_DATA.filter((user) => user.id === groupOwner)[0];
        owner = { ...owner, role: "owner" };

        setAllPeopleInGroup((old) => [...old, owner]);
        //allPeopleInGroup.push({ ...owner, role: "owner" });
      } else {
        setNotation("You are the owner of this group");
        const owner = { ...userProfile, role: "owner" };
        setAllPeopleInGroup((old) => [...old, owner]);
      }

      if (groupManagers.length !== 0) {
        groupManagers.forEach((item) => {
          // if (item !== userProfile.id) {
          //   fetchUserInfo(item, "manager");
          // }

          //for test
          //console.log(item);
          const manager = USER_DATA.filter((user) => user.id === item)[0];
          console.log("manager is:");
          console.log(manager);
          setAllPeopleInGroup((old) => [
            ...old,
            { ...manager, role: "manager" },
          ]);
          console.log("Fetchc Manager");
          console.log(allPeopleInGroup);

          //allPeopleInGroup.push({ ...manager, role: "manager" });
        });
      }

      if (groupMembers.length !== 0) {
        //fectch memebrs' info
        groupMembers.forEach((item) => {
          //for test only
          let member = USER_DATA.filter((user) => user.id === item)[0];
          member = { ...member, role: "member" };

          // console.log("members is");
          // console.log(member);
          setAllPeopleInGroup((old) => [...old, member]);

          //allPeopleInGroup.push({ ...member, role: "member" });
        });

        console.log("all members in group:");
        console.log(allPeopleInGroup);
      }
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
        <Avatar
          rounded
          source={{
            uri:
              "https://avatars0.githubusercontent.com/u/32242596?s=460&u=1ea285743fc4b083f95d6ee0be2e7bb8dcfc676e&v=4",
          }}
          size="large"
        />
        {item.role !== "member" ? (
          <Badge
            value={item.role}
            status="success"
            containerStyle={{ position: "absolute", top: 6, right: 10 }}
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
              uri: `http://localhost:5000/uploads/${selectedGroup.groupImage}`,
            }}
            style={{
              height: 200,
              justifyContent: "center",
              resizeMode: "contain",
            }}
          >
            <View>
              <Text style={styles.text}>{selectedGroup.groupName}</Text>
            </View>
            <View>
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                GroupID: {selectedGroup._id}
              </Text>
            </View>
            <View>
              <Text
                style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
              >
                {notation}
              </Text>
            </View>
            <View>
              <Text
                style={{ fontSize: 15, color: "white", fontWeight: "bold" }}
              >
                Created at:{selectedGroup.createdAt}
              </Text>
            </View>
            <Divider style={{ margin: 10, backgroundColor: "black" }} />
          </ImageBackground>
        </View>

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
                height: 60,
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
      {allPeopleInGroup.length !== 0 ? (
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
