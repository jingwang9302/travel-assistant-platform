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
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  USER_SERVICE,
  GROUP_SERVICE,
  UPLOAD_IMAGE_URL,
} from "../../config/urls";
import {
  Icon,
  Input,
  Button,
  ListItem,
  Avatar,
  Badge,
  SearchBar,
  Header,
  Divider,
} from "react-native-elements";
import LoginAlertScreen from "../user/LoginAlertScreen";

const GroupManageScreen = ({ navigation, route }) => {
  const userProfile = useSelector((state) => state.user);

  const [buttonDisplay, setButtonDisplay] = useState([
    { show: true, name: "Move to Manager" },
    { show: true, name: "Move to Member" },
    { show: true, name: "Change Ownership" },
    { show: true, name: "Delete User" },
  ]);
  const [test2, setTest2] = useState([]);

  const {
    currUserRole,
    groupId,
    selectedUserDetail,
    readOnly,
    userId,
  } = route.params;

  useEffect(() => {
    loadManageScreen();
  }, []);

  if (!userProfile.isLogin) {
    return <LoginAlertScreen />;
  }

  const moveToManager = () => {
    axios({
      method: "PUT",
      url:
        GROUP_SERVICE +
        `update/addmanager/${userProfile.id}/${groupId}/${selectedUserDetail.id}`,
    })
      .then((res) => {
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Failed", error.response.data.error);
      });
  };
  const deleteUser = () => {
    axios({
      method: "DELETE",
      url:
        GROUP_SERVICE +
        `delete/${userProfile.id}/${groupId}/${selectedUserDetail.id}`,
    })
      .then((res) => {
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

  const changeOwnership = () => {
    axios({
      method: "PUT",
      url:
        GROUP_SERVICE +
        `update/groupowner/${userProfile.id}/${groupId}/${selectedUserDetail.id}`,
    })
      .then((res) => {
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Failed", error.response.data.error);
      });
  };

  const moveToMember = () => {
    axios({
      method: "PUT",
      url:
        GROUP_SERVICE +
        `update/downgrademanager/${userProfile.id}/${groupId}/${selectedUserDetail.id}`,
    })
      .then((res) => {
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Failed", error.response.data.error);
      });
  };
  const buttonList = [
    {
      show: true,
      name: "Move to Manager",
      onPress: () => {
        moveToManager();
      },
    },
    {
      show: true,
      name: "Move to Member",
      onPress: () => {
        moveToMember();
      },
    },
    {
      show: true,
      name: "Change Ownership",
      onPress: () => {
        changeOwnership();
      },
    },
    {
      show: true,
      name: "Delete User",
      onPress: () => {
        deleteUser();
      },
    },
  ];

  const loadManageScreen = () => {
    if (readOnly) {
      return;
    }
    if (currUserRole === "owner" && selectedUserDetail.role === "manager") {
      setTest2([buttonList[1], buttonList[2], buttonList[3]]);
    } else if (
      currUserRole === "owner" &&
      selectedUserDetail.role === "member"
    ) {
      setTest2([buttonList[0], buttonList[2], buttonList[3]]);
    } else if (
      currUserRole === "manager" &&
      selectedUserDetail.role === "member"
    ) {
      setTest2([buttonList[3]]);
    }
  };
  const fetchUserInfo = (token, userId, userRole) => {
    axios({
      method: "get",
      url: USER_SERVICE + "/profile/" + userId,
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(function (response) {
        //need to check API
        setCurrentUser(response.data);
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginTop: 5 }}>
        <ListItem bottomDivider>
          <Avatar
            rounded
            source={{
              uri: UPLOAD_IMAGE_URL + selectedUserDetail.avatarUrl,
            }}
            renderPlaceholderContent={<ActivityIndicator />}
            size="xlarge"
          />

          <ListItem.Content>
            <ListItem.Title style={styles.itemTitle}>
              {selectedUserDetail.firstName} {selectedUserDetail.lastName}
            </ListItem.Title>
            {selectedUserDetail.role ? (
              <ListItem.Subtitle style={{ fontSize: 25 }}>
                role: {selectedUserDetail.role}
              </ListItem.Subtitle>
            ) : null}

            <ListItem.Subtitle style={{ fontSize: 20 }}>
              Id: {selectedUserDetail.id}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </View>
      <View></View>
      <View style={styles.buttonContainer}>
        <Divider style={{ margin: 5, backgroundColor: "black" }} />
        {test2 && test2.length !== 0
          ? test2.map((item, index) => {
              if (item.show) {
                return (
                  <Button
                    key={index}
                    buttonStyle={{ marginHorizontal: 10, borderRadius: 10 }}
                    title={item.name}
                    style={{ marginVertical: 5 }}
                    onPress={item.onPress}
                  />
                );
              }
            })
          : null}
      </View>
    </SafeAreaView>
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
    marginVertical: 5,
    justifyContent: "space-between",
  },
  button: {
    paddingBottom: 5,
  },
});

export default GroupManageScreen;
