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
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../components/Loader";
import {
  Icon,
  Input,
  Button,
  ListItem,
  Avatar,
  SearchBar,
  Badge,
} from "react-native-elements";
import {
  setGroupsUserIn,
  clearTravelgroup,
} from "../../redux/actions/travelgroupAction";

import {
  setOngoingPlan,
  clearPlans,
} from "../../redux/actions/travelPlanAction";

import LoginAlertScreen from "../user/LoginAlertScreen";

const GroupListScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  let [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { groups } = useSelector((state) => state.groups);
  const userProfile = useSelector((state) => state.user);
  const { ongoingPlan } = useSelector((state) => state.plans);
  const [groupsSearched, setGroupsSearched] = useState([]);
  const dispatch = useDispatch();

  // any hooks must be put on the top of any condition function or element
  useEffect(() => {
    if (userProfile.isLogin) {
      if (!ongoingPlan) {
        fectchOngoingPlan();
      }

      setErrorMessage("");
      setLoading(true);
      fetchGroups();

      setLoading(false);
    } else {
      dispatch(clearTravelgroup());
      dispatch(clearPlans());
    }
  }, [userProfile.isLogin]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons
          HeaderButtonComponent={IoniconsHeaderButton}
          children={(Badge, Button)}
        >
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
          </OverflowMenu>
          {ongoingPlan ? (
            <Badge
              status="warning"
              containerStyle={{ marginTop: 7 }}
              textStyle={{
                color: "white",
                fontSize: 14,
              }}
              value="Ongoing"
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
    setGroupsSearched([]);
    setIsRefreshing(true);
    //console.log("before axios");
    axios({
      method: "get",
      url: GROUP_SERVICE + "read/groups_in/" + userProfile.id,
    })
      .then(function (res) {
        const { data } = res.data;
        //setGroups(data);
        dispatch(setGroupsUserIn(data));
        //console.log("fech is operated");
        setIsRefreshing(false);
      })
      .catch(function (error) {
        console.log(error.response);
        if (error.response && error.response.status === 404) {
          const message =
            "You are not in any travel groups! Please create a new group or search existing groups";
          setErrorMessage(message);
        } else {
          console.log(error);
        }
        setIsRefreshing(false);
      });
  }
  const searchGroups = (groupName) => {
    axios({
      method: "GET",
      url: GROUP_SERVICE + `search/${userProfile.id}/${groupName}`,
    })
      .then((res) => {
        const { data } = res.data;
        setGroupsSearched(data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          //console.log(error.response);
          Alert.alert(error.response.data.error);
        } else {
          console.log(error);
        }
      });
  };

  const fectchOngoingPlan = () => {
    axios({
      method: "GET",
      url: PLAN_SERVICE + `read_ongoing/${userProfile.id}`,
    })
      .then((res) => {
        const { data } = res.data;
        dispatch(setOngoingPlan(data._id));
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else {
          console.log(error);
        }
      });
  };

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("GroupDetail", {
            groupId: item._id,
          });
        }}
      >
        <ListItem bottomDivider>
          <Avatar
            avatarStyle={{ borderRadius: 10 }}
            size="large"
            source={{
              uri: `${GCS_URL}${item.groupImage}`,
            }}
            renderPlaceholderContent={<ActivityIndicator />}
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
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
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
                //console.log(`search is: ${search}`);
                searchGroups(search);
                //setSearch("");
              }
            },
          }}
        />
      </View>

      <View>
        {groupsSearched && groupsSearched.length !== 0 ? (
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 20 }}>Travel Groups Searched: </Text>
              <Icon
                name="close"
                onPress={() => {
                  setGroupsSearched([]);
                }}
              />
            </View>
            <View>
              <FlatList
                onRefresh={fetchGroups}
                refreshing={isRefreshing}
                data={groupsSearched}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
              />
            </View>
          </View>
        ) : (
          <View>
            {groups && groups.length !== 0 ? (
              <FlatList
                onRefresh={fetchGroups}
                refreshing={isRefreshing}
                data={groups}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
              />
            ) : (
              <Text style={{ fontSize: 20 }}>{errorMessage}</Text>
            )}
          </View>
        )}
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
    marginBottom: 59,
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
