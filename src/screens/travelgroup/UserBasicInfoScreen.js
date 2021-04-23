import { Button, ListItem, Avatar } from "react-native-elements";

import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { StyleSheet, View, Alert, ActivityIndicator } from "react-native";
import {
  USER_SERVICE,
  GROUP_SERVICE,
  UPLOAD_IMAGE_URL,
} from "../../config/urls";

const UserBasicInfoScreen = ({ navigation, route }) => {
  const { userInfo, foraddrole, groupId } = route.params;
  const userProfile = useSelector((state) => state.user);
  console.log(`groupId is: ${groupId}`);

  const addUserToGroup = (idToAdd) => {
    axios({
      method: "PUT",
      url:
        GROUP_SERVICE +
        `update/${foraddrole}/${userProfile.id}/${groupId}/${idToAdd}`,
    })
      .then((res) => {
        console.log(res.data.success);
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error.response.data.error);
        Alert.alert(error.response.data.error);
      });
  };
  return (
    <View style={{ marginTop: 5 }}>
      <ListItem bottomDivider>
        <Avatar
          rounded
          source={{
            uri: UPLOAD_IMAGE_URL + userInfo.avatarUrl,
          }}
          renderPlaceholderContent={<ActivityIndicator />}
          size="xlarge"
        />

        <ListItem.Content>
          <ListItem.Title style={styles.itemTitle}>
            {userInfo.firstName} {userInfo.lastName}
          </ListItem.Title>

          <ListItem.Subtitle style={{ fontSize: 20 }}>
            Id: {userInfo.id}
          </ListItem.Subtitle>
          <ListItem.Subtitle style={{ fontSize: 20 }}>
            Email: {userInfo.email}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
      <Button
        title="Add To Group"
        buttonStyle={{ marginHorizontal: 10, borderRadius: 5 }}
        onPress={() => {
          addUserToGroup(userInfo.id);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemTitle: {
    color: "black",
    fontWeight: "bold",
    fontSize: 30,
  },
  itemSubtitle: {
    color: "black",
  },
});

export default UserBasicInfoScreen;
