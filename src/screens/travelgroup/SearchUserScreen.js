import {
  Icon,
  Input,
  Button,
  ListItem,
  Avatar,
  SearchBar,
  Header,
} from "react-native-elements";

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
import React, { createRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GROUP_SERVICE,
  PLAN_SERVICE,
  USER_SERVICE,
  UPLOAD_IMAGE_URL,
} from "../../config/urls";

import { USER_DATA } from "../travelgroup/Data";

const SearchUserScreen = ({ navigation, route }) => {
  const [search, setSearch] = useState("");
  const [userSearched, setUserSearched] = useState();
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const { groupId, foraddrole, group } = route.params;
  const userProfile = useSelector((state) => state.user);

  console.log("group passed is");
  console.log(groupId);
  useEffect(() => {
    getFriend();
  }, []);

  if (!group.groupMembers) {
    group.groupMembers = [];
  }

  if (!group.groupManagers) {
    group.groupManagers = [];
  }

  // const searchUser = () => {
  //   console.log("search is operated");
  // };

  const getFriend = () => {
    axios({
      method: "get",
      url: USER_SERVICE + "/friends/" + userProfile.id,
      headers: {
        Authorization: "Bearer " + userProfile.token,
      },
    })
      .then(function (response) {
        console.log("friends get");
        console.log(response.data);
        setFriends(response.data);
      })
      .catch(function (error) {
        console.log(error.response);
      });
  };

  const fetchUserInfo = (userId) => {
    axios({
      method: "get",
      url: USER_SERVICE + "/profile/basic/" + userId,
      headers: {
        Authorization: "Bearer " + userProfile.token,
      },
    })
      .then(function (response) {
        //need to check API
        const searchedUser = response.data;
        console.log("searched user info:");
        console.log(searchedUser);
        navigation.navigate("UserBasicInfo", {
          userInfo: searchedUser,
          foraddrole,
          groupId,
        });
        setUserSearched(basicUserInfo);

        //setAllPeopleInGroup((oldarr) => [...oldarr, basicUserInfo]);
        // setAll([..all, basicUserInfo]);

        // setAllPeopleInGroup((old) => {
        //   [...old, basicUserInfo];
        // });
      })
      .catch(function (error) {
        setErrorMessage(error.response.data);
        Alert.alert(error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  const addUserToGroup = (idToAdd) => {
    axios({
      method: "PUT",
      url:
        GROUP_SERVICE +
        `update/${foraddrole}/${userProfile.id}/${groupId}/${idToAdd}`,
    })
      .then((res) => {
        Alert.alert("Successful");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert(error.response.data.error);
      });
  };

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    //only user not in the current gourp wil appear
    <View>
      {group.groupMembers.includes(item.id) ||
      group.groupManagers.includes(item.id) ||
      group.groupOwner === item.id ? null : (
        <TouchableOpacity
          onLongPress={() => {
            Alert.alert("Alert", "Are you sure to add this user?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "OK",
                onPress: () => {
                  addUserToGroup(item.id);
                },
              },
            ]);
          }}
          onPress={() => {
            navigation.navigate("UserBasicInfo", {
              userInfo: item,
              foraddrole,
              groupId,
            });
          }}
        >
          <ListItem bottomDivider>
            <Avatar
              avatarStyle={{ borderRadius: 10 }}
              size="large"
              source={{
                uri: UPLOAD_IMAGE_URL + item.avatarUrl,
              }}
            />
            <ListItem.Content>
              <ListItem.Title>
                {item.firstName} {` ${item.lastName}`}
              </ListItem.Title>
              <ListItem.Subtitle>Id: {item.id}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View>
      <View>
        <SearchBar
          lightTheme={true}
          color="black"
          round={false}
          placeholder="Search Users Here..."
          onChangeText={(input) => setSearch(input)}
          value={search}
          searchIcon={{
            name: "search",
            color: "black",
            size: 24,

            onPress: () => {
              if (search) {
                fetchUserInfo(search);
                setSearch("");
              }
            },
          }}
        />
      </View>
      <View>
        <FlatList
          data={friends}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
    </View>
  );
};

export default SearchUserScreen;
