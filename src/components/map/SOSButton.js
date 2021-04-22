import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { sendSOSToOngoingPlanGroupChat } from "../../utils/MessagingUtils";

const { height, width } = Dimensions.get("window");

const SOSButton = () => {
  const { ongoingPlan } = useSelector((state) => state.plans);
  const currentUserProfile = useSelector((state) => state.user);
  return (
    <View
      style={{
        position: "absolute",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        top: 54,
        right: width * 0.02,
      }}
    >
      <TouchableOpacity
        style={{
          //style of red container
          flexDirection: "row",
          alignItems: "center",
          height: 43,
          width: 43,
          paddingLeft: 6,
          paddingVertical: 1,
          borderRadius: 21.5,
          backgroundColor: "red",
        }}
        onPress={() => {
          sendSOSToOngoingPlanGroupChat(currentUserProfile, ongoingPlan);
          alert("SOS message sent.");
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 43,
          }}
        >
          <Text style={{ alignSelf: "center" }}>SOS</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default SOSButton;
