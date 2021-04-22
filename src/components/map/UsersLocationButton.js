import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const UsersLocationButton = ({ route, marker }) => {
  const navigation = useNavigation();
  const { height, width } = Dimensions.get("window");

  return (
    <View
      style={{
        // backgroundColor: "grey",
        position: "absolute",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        top: 102,
        right: width * 0.02,
      }}
    >
      <TouchableOpacity
        style={{
          //style of the green container
          flexDirection: "row",
          alignItems: "center",
          height: 43,
          width: 43,
          paddingLeft: 6,
          paddingVertical: 1,
          borderRadius: 21.5,
          backgroundColor: "#7aeb7a",
        }}
        onPress={() => {
          navigation.navigate("UsersLocation", { marker });
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 43,
          }}
        >
          <Icon
            name={"location-history"}
            size={30}
            type={"materialIcons"}
            // color={"#5f91c1"}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default UsersLocationButton;
