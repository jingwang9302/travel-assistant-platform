import React, { createRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupsUserIn } from "../../redux/actions/travelgroupAction";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import {
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import { USER_SERVICE, GROUP_SERVICE, GROUP_BASE_URL } from "../../config/urls";
import Loader from "../../components/Loader";
import { Icon, Input, Image, Button } from "react-native-elements";
import { set } from "react-native-reanimated";
import LoginAlertScreen from "../user/LoginAlertScreen";

const CreateNewGroupScreen = ({ navigation }) => {
  const userProfile = useSelector((state) => state.user);
  const { groups } = useSelector((state) => state.groups);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState({ localUri: "" });

  //const [isGroupCreateSuccess, setGroupCreateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groupNameInputError, setGroupNameInputError] = useState("");
  const [groupDescriptionInputError, setGroupDescriptionInputError] = useState(
    ""
  );
  const groupNameInputRef = createRef();
  const groupDescriptionRef = createRef();

  if (!userProfile.isLogin) {
    return <LoginAlertScreen />;
  }

  const createNewGroup = () => {
    setGroupNameInputError("");
    setGroupDescriptionInputError("");

    // setErrorMessage("");

    if (!groupName) {
      //setErrorMessage("please add a group name");
      setGroupNameInputError("please add a group name");
      return;
    }

    if (!groupDescription) {
      setGroupDescriptionInputError("please add a group description");
      return;
    }

    setLoading(true);
    axios({
      method: "post",
      url: GROUP_SERVICE + "create/" + userProfile.id,
      data: {
        groupName,
        groupOwner: userProfile.id,
        groupDescription,
      },
    })
      .then(function (res) {
        // getGroupsUserIn(userProfile.id);
        const { data } = res.data;
        //console.log(res.data.data);
        setLoading(false);

        if (selectedImage.localUri && selectedImage.localUri !== "") {
          // console.log("before upload image, groupId is:");
          // console.log(data._id);
          upLoadImage(selectedImage.localUri, data._id);
        }

        navigation.goBack();

        // navigation.navigate("GroupDetail", {
        //   groupId: res.data.data._id,
        // });
      })
      .catch(function (error) {
        setLoading(false);
        //setErrorMessage(error.response.data.error);
        console.log(error.response.data.error);
        Alert.alert("Alert", error.response.data.error);
      });
  };

  const upLoadImage = (uri, groupId) => {
    //const uri = selectedImage.localUri;
    const uriParts = uri.split(".");
    console.log("uri:");
    console.log(uri);
    //console.log(uriParts);
    const fileType = uriParts[uriParts.length - 1];
    console.log(`file type: ${fileType}`);
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    });

    axios({
      method: "PUT",
      url: GROUP_SERVICE + "updateimage/" + `${userProfile.id}/${groupId}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        const { data } = res.data;
        console.log(`image name is ${data}`);
      })
      .catch((error) => {
        //setErrorMessage(error.response.data.error);
        Alert.alert("Alert", error.response.data.error);
        console.log(error.response.data.error);
      });
  };

  const openImagePickerAsync = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access images is required");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log("uri is:");
    console.log(pickerResult);
    if (pickerResult.cancelled === true) {
      return;
    }
    setSelectedImage({ localUri: pickerResult.uri });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Loader loading={loading} message="Creating..." />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Create Travelgroup</Text>
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <Input
              style={styles.inputStyle}
              onChangeText={(input) => setGroupName(input)}
              underlineColorAndroid="#f000"
              placeholder="Input Travelgroup Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              ref={groupNameInputRef}
              errorMessage={groupNameInputError}
              blurOnSubmit={false}
              leftIcon={<Icon name="people" size={24} color="black" />}
              rightIcon={
                <Icon
                  name="close"
                  size={20}
                  onPress={() => {
                    groupNameInputRef.current.clear();
                    setGroupName("");
                    setGroupNameInputError("");
                  }}
                />
              }
            />

            <Input
              style={styles.inputStyle}
              onChangeText={(input) => setGroupDescription(input)}
              underlineColorAndroid="#f000"
              placeholder="Input Travelgroup Description"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              ref={groupDescriptionRef}
              errorMessage={groupDescriptionInputError}
              blurOnSubmit={false}
              leftIcon={<Icon name="people" size={24} color="black" />}
              rightIcon={
                <Icon
                  name="close"
                  size={20}
                  onPress={() => {
                    groupDescriptionRef.current.clear();
                    setGroupDescription("");
                    setGroupDescriptionInputError("");
                  }}
                />
              }
            />
          </View>

          <View style={{ alignItems: "center", marginTop: 30 }}>
            {selectedImage.localUri ? (
              <Image
                source={{ uri: selectedImage.localUri }}
                style={{ width: 400, height: 200 }}
                PlaceholderContent={
                  <Icon
                    name="add-circle-outline"
                    type="ionicon"
                    size={100}
                    color="grey"
                  />
                }
                onPress={openImagePickerAsync}
              />
            ) : (
              <Image
                style={{ width: 400, height: 200 }}
                PlaceholderContent={
                  <Icon
                    name="add-circle-outline"
                    type="ionicon"
                    size={100}
                    color="grey"
                  />
                }
                onPress={openImagePickerAsync}
              />
            )}
          </View>
          <View style={{ marginTop: 10 }}>
            <Button
              buttonStyle={{ marginHorizontal: 10, borderRadius: 10 }}
              title="submit"
              //style={{ marginVertical: 20 }}
              onPress={createNewGroup}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

//Screen Style
const styles = StyleSheet.create({
  title: {
    color: "#FFFFFF",
    fontSize: 25,
    paddingTop: 15,
  },
  SectionStyle: {
    marginHorizontal: 10,
  },
  buttonStyle: {
    backgroundColor: "#307016",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#307016",
    height: 40,
    alignItems: "center",
    borderRadius: 20,
    marginTop: 30,
    marginLeft: 35,
    marginRight: 35,

    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
  },
  errorTextStyle: {
    color: "red",
    textAlign: "center",
    fontSize: 14,
  },
  successTextStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    padding: 30,
  },
});

export default CreateNewGroupScreen;
