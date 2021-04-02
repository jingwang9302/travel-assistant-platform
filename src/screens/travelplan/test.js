import { View, Alert } from "react-native";
import { Button } from "react-native-elements";
import * as Location from "expo-location";
import React, { createRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const TestScreen = () => {
  const [positionSharing, setSharingPosition] = useState(false);
  const [location, setLocation] = useState();
  const [mylocation, setMylocatin] = useState(1);
  console.log("mylocation is :");
  console.log(mylocation);
  const k = 1;

  useEffect(() => {
    console.log("effec is operated");
    console.log(positionSharing);
    callback();

    if (positionSharing) {
      console.log(`when postionsharing is true`);
    }

    // if (positionSharing) {
    //   startSharingPosition();
    // }
    //   const rem = async () => {
    //     try {
    //       const r = await Location.watchPositionAsync();
    //       r.remove();
    //       console.log("watch removed");
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   };
    //   rem();
  }, [callback, positionSharing]);

  const callback = React.useCallback(() => {
    // console.log("button clicked, position sharing is : ");
    // console.log(positionSharing);
    //Alert.alert("Button Clicked", `positionsharing is ${positionSharing}`);
    console.log("call baccck");
  }, [k]);

  const startSharingPosition = async () => {
    const hasPermission = verifyPermissions();
    //console.log(`pemission is : ${hasPermission}`);
    //console.log(hasPermission);
    if (hasPermission) {
      // Alert.alert("Position Sharing", "Position is being shared");
      try {
        const mlocation = await Location.watchPositionAsync(
          { distanceInterval: 10000, accuracy: Location.Accuracy.Low },
          (location) => {
            setLocation(location);
            console.log(`location updated is: ${location.coords.latitude}`);
          }
        );
        if (mlocation) {
          setMylocatin(mlocation);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const verifyPermissions = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Warning", "Permission to access location was denied");
      return false;
    }
    return true;
  };

  return (
    <View>
      {/* <Button
        title="share postion"
        onPress={() => {
          setSharingPosition(true);
          //startSharingPosition();
        }}
      />
      <Button
        title="stop sharing"
        onPress={async () => {
          setSharingPosition(false);
          await mylocation.remove();

          console.log("removed");
        }}
      /> */}
      <Button
        title="Start Sharing"
        onPress={() => {
          setSharingPosition(true);
        }}
      />
      <Button
        title="Stop Sharing"
        onPress={() => {
          setSharingPosition(false);
        }}
      />
      <Button
        title="setlocation"
        onPress={() => {
          setMylocatin((old) => {
            return old + 1;
          });
          console.log(`location after increased is: ${mylocation}`);
        }}
      />
    </View>
  );
};

export default TestScreen;
