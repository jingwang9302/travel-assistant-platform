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
import { GROUP_SERVICE, PLAN_SERVICE } from "../../config/urls";

import { USER_DATA } from "../travelgroup/Data";

const SearchUserScreen = ({ navigation, route }) => {
  const [search, setSearch] = useState("");
  const { groupId, foraddrole, group } = route.params;

  console.log("group passed is");
  console.log(group);
  if (!group.groupMembers) {
    group.groupMembers = [];
  }

  if (!group.groupManagers) {
    group.groupManagers = [];
  }
  const userProfile = useSelector((state) => state.user);

  const searchUser = () => {
    console.log("search is operated");
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
          onPress={() => {
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
        >
          <ListItem bottomDivider>
            <Avatar
              avatarStyle={{ borderRadius: 10 }}
              size="large"
              source={{
                uri:
                  "https://avatars0.githubusercontent.com/u/32242596?s=460&u=1ea285743fc4b083f95d6ee0be2e7bb8dcfc676e&v=4",
              }}
            />
            <ListItem.Content>
              <ListItem.Title>
                {item.firstName} {` ${item.lastName}`}
              </ListItem.Title>
              <ListItem.Subtitle>{item.id}</ListItem.Subtitle>
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
                searchUser();
                setSearch("");
              }
            },
          }}
        />
      </View>
      <View>
        <FlatList
          data={USER_DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
    </View>
  );
};

export default SearchUserScreen;
