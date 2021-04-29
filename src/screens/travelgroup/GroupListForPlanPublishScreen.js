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
  TouchableOpacity,
  View,
  FlatList,
  StatusBar,
} from "react-native";

import { ListItem, Avatar } from "react-native-elements";

import { Alert } from "react-native";

const GroupListForPlanPublishScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { groups } = useSelector((state) => state.groups);
  const userProfile = useSelector((state) => state.user);

  const { planId } = route.params;
  const publishPlanToGroup = (groupId) => {
    axios({
      method: "PUT",
      url: PLAN_SERVICE + `update/${userProfile.id}/${planId}`,
      data: { status: 1, travelGroup: groupId },
    })
      .then((res) => {
        //go back to plan detail
        navigation.goBack();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          Alert.alert(error.response.data.error);
        } else {
          console.log(error);
        }
      });
  };

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        Alert.alert(
          "Alert",
          `Plan will be publshed to group: ${item.groupName}`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Ok",
              onPress: () => {
                publishPlanToGroup(item._id);
              },
            },
          ]
        );
      }}
    >
      <ListItem bottomDivider>
        <Avatar
          avatarStyle={{ borderRadius: 10 }}
          size="large"
          source={{
            uri: `${GCS_URL}${item.groupImage}`,
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
      <View>
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </View>
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

export default GroupListForPlanPublishScreen;
