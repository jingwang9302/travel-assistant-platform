import React, { createRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GROUP_SERVICE,
  PLAN_SERVICE,
  GROUP_BASE_URL,
  GCS_URL,
} from "../../config/urls";
import axios from "axios";

import {
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  Alert,
} from "react-native";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";

import { USER_SERVICE } from "../../config/urls";
import Loader from "../../components/Loader";
import {
  Icon,
  Input,
  Button,
  ListItem,
  Avatar,
  SearchBar,
  Header,
} from "react-native-elements";
import {
  setGroupsUserIn,
  setCurrentGroup,
  clearCurrGroup,
  clearTravelgroup,
  UPDATE_GROUP,
  SET_CURRENTGROUP,
} from "../../redux/actions/travelgroupAction";
import { GROUP_DATA } from "./Data";
import LoginAlertScreen from "../user/LoginAlertScreen";
import { set } from "react-native-reanimated";

const GroupListScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  let [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { groups } = useSelector((state) => state.groups);
  const userProfile = useSelector((state) => state.user);
  const { ongoingPlan } = useSelector((state) => state.plans);
  const dispatch = useDispatch();

  const [buttonDisplay, setButtonDisplay] = useState([]);

  // let forPlan = false;
  // if (forPlanPublish) {
  //   forPlan = forPlanPublish;
  // }
  //forPlan = forPlanPublish

  // any hooks must be put on the top of any condition function or element
  useEffect(() => {
    if (userProfile.isLogin) {
      setLoading(true);
      fetchGroups();
      setLoading(false);
    } else {
      dispatch(clearTravelgroup());
    }
  }, [userProfile.isLogin]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <OverflowMenu
            style={{ marginHorizontal: 10 }}
            OverflowIcon={() => <Icon name="menu" size={30} />}
          >
            <HiddenItem
              title="Create a Group"
              onPress={() => {
                navigation.navigate("GroupCreate");
              }}
            />
            <HiddenItem
              title="Test"
              onPress={() => {
                navigation.navigate("Test");
              }}
            />
          </OverflowMenu>
          {ongoingPlan ? (
            <Item
              iconName="airplane-outline"
              onPress={() => {
                navigation.navigate("PlanDetail", { planId: ongoingPlan });
              }}
            />
          ) : null}
        </HeaderButtons>
      ),
    });
  }, [ongoingPlan]);

  const IoniconsHeaderButton = (props) => (
    <HeaderButton IconComponent={Ionicons} iconSize={23} {...props} />
  );

  if (!userProfile.isLogin) {
    ////setErrorMessage("");
    return <LoginAlertScreen />;
  }

  function fetchGroups() {
    setErrorMessage("");
    setIsRefreshing(true);
    console.log("before axios");
    axios({
      method: "get",
      url: GROUP_SERVICE + "read/groups_in/" + userProfile.id,
    })
      .then(function (res) {
        const { data } = res.data;
        //setGroups(data);
        dispatch(setGroupsUserIn(data));
        console.log("fech is operated");
        setIsRefreshing(false);
      })
      .catch(function (error) {
        console.log(error.response.data.error);
        setErrorMessage(error.response.data.error);
        setIsRefreshing(false);
      });
  }

  if (errorMessage) {
    //dispatch({ type: CLEAR_ERRORS });
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ backgroundColor: "white", marginVertical: 20 }}>
          <SearchBar
            lightTheme={true}
            color="black"
            round={true}
            placeholder="Search Travelgroups Here..."
            onChangeText={(content) => setSearch(content)}
            value={search}
            searchIcon={{
              name: "search",
              onPress: () => {
                if (search) {
                  //console.log(`search is ${search}`);
                  navigation.navigate("GroupDetail", {
                    //for test
                    groupId: search,
                  });
                }
              },
            }}
          />
        </View>
        <ListItem bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{errorMessage}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Button title="Try Again" onPress={fetchGroups} />
      </SafeAreaView>
    );
  }
  const publishPlanToGroup = (groupId) => {
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `update/${userProfile.id}/${planId}`,
      data: { status: 1, travelGroup: groupId },
    })
      .then((res) => {
        //go back to plan detail
        navigation.back();
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        // if (forPlanPublish) {
        //   Alert.alert(
        //     "Alert",
        //     `Plan will be publshed to this group with Id ${item._id}`,
        //     [
        //       { text: "Cancel", style: "cancel" },
        //       {
        //         text: "Ok",
        //         onPress: () => {
        //           publishPlanToGroup(item._id);
        //         },
        //       },
        //     ]
        //   );
        // } else {
        navigation.navigate("GroupDetail", {
          groupId: item._id,
        });
        // }

        //dispatch(setCurrentGroup(item));
      }}
    >
      <ListItem bottomDivider>
        <Avatar
          avatarStyle={{ borderRadius: 10 }}
          size="large"
          source={{
            uri: `${GCS_URL}${item.groupImage}`,
            //uri: `${GROUP_BASE_URL}/uploads/${item.groupImage}`,
          }}
        />
        <ListItem.Content>
          <ListItem.Title style={styles.itemTitle}>
            {item.groupName}
          </ListItem.Title>
          <ListItem.Subtitle>active</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
        <OverflowMenu
          style={{ marginHorizontal: 10 }}
          OverflowIcon={({ color }) => (
            <Ionicons name="ios-more" size={23} color={color} />
          )}
        >
          <Item
            title="Create a Group"
            onPress={() => alert("create new group")}
          />
          <Item title="Create a plan " onPress={() => alert("create a plan")} />
        </OverflowMenu>
      </HeaderButtons> */}
      <Loader loading={loading} />
      <View>
        <SearchBar
          lightTheme={true}
          color="black"
          round={false}
          placeholder="Search Travelgroups Here..."
          onChangeText={(input) => setSearch(input)}
          value={search}
          searchIcon={{
            name: "search",
            color: "black",
            size: 24,

            onPress: () => {
              if (search) {
                console.log(`search is: ${search}`);
                navigation.navigate("GroupDetail", {
                  groupId: search,
                });
                setSearch("");
              }
            },
          }}
        />
      </View>
      <View>
        <FlatList
          onRefresh={fetchGroups}
          refreshing={isRefreshing}
          data={groups}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
      <TouchableOpacity
        style={styles.touchableOpacityStyleFloating}
        onPress={() => navigation.navigate("GroupCreate")}
        activeOpacity={0.7}
      >
        <Icon name="add-box" type="material" size={50} color="skyblue" />
      </TouchableOpacity>
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
    fontWeight: "bold",
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
    bottom: 10,
  },
});

export default GroupListScreen;
