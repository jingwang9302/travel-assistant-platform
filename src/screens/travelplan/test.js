import { View, Alert, Platform } from "react-native";
import { Button } from "react-native-elements";
import * as Location from "expo-location";
import React, { createRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { USER_SERVICE } from "../../config/urls";
import { setOngoingPlan } from "../../redux/actions/travelPlanAction";
import * as TaskManager from "expo-task-manager";
const TestScreen = ({ navigation }) => {
  const [positionSharing, setSharingPosition] = useState(false);
  //const [location, setLocation] = useState();
  const [mylocation, setMylocatin] = useState();

  const [date, setDate] = useState(new Date());

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [subscribeToLoactionUpdate, setSubscribeLocationUpdate] = useState(
    null
  );
  const [intevalObj, setIntervalObj] = useState();

  const userProfile = useSelector((state) => state.user);

  let interval = null;
  useEffect(() => {
    return () => {
      stopSharePostion();
    };
  });
  const fetchUserInfo = (userId, userRole) => {
    axios({
      method: "get",
      url: USER_SERVICE + "/profile/basic/" + userId,
      headers: {
        Authorization: "Bearer " + userProfile.token,
      },
    })
      .then(function (response) {
        console.log(response.data);
        //need to check API
        const basicUserInfo = { ...response.data, role: userRole };
        console.log("basic user info:");
        console.log(basicUserInfo);
      })
      .catch(function (error) {
        setErrorMessage(error.response.data);
        console.log(error.response.data);
      });
  };

  const startSharePosition = () => {
    setSharingPosition(true);
    if (!interval) {
      interval = setInterval(() => {
        console.log("Interval is operated");
      }, 1000);
    }
  };

  const stopSharePostion = () => {
    setSharingPosition(false);
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  TaskManager.defineTask("UpdateLocation", ({ data: { locations }, error }) => {
    if (error) {
      // check `error.message` for more details.
      return;
    }
    console.log("Received new locations", locations[0].coords.longitude);
  });

  // return <DatePicker date={date} onDateChange={setDate} />;

  // console.log("mylocation is :");
  // console.log(mylocation);
  //const k = 1;

  // useEffect(() => {
  //   console.log("effec is operated");
  //   console.log(positionSharing);

  //   if (!positionSharing && subscribeToLoactionUpdate) {
  //     subscribeToLoactionUpdate.remove();
  //   } else {
  //     startSharingPosition();
  //   }
  // }, [positionSharing]);

  // const callback = React.useCallback(() => {
  //   // console.log("button clicked, position sharing is : ");
  //   // console.log(positionSharing);
  //   //Alert.alert("Button Clicked", `positionsharing is ${positionSharing}`);
  //   console.log("call baccck");
  // }, [k]);
  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || date;
  //   //setShow(Platform.OS === "ios");
  //   setDate(currentDate);
  //   console.log("date picked");
  //   console.log(date);
  // };

  // const showMode = (currentMode) => {
  //   setShow(true);
  //   setMode(currentMode);
  // };

  // const showDatepicker = () => {
  //   showMode("date");
  // };

  // const showTimepicker = () => {
  //   showMode("time");
  // };
  // const showDateTimePicker = () => {
  //   showMode("datetime");
  // };

  // const save = () => {
  //   const nowdate = new Date();
  //   if (date < nowdate) {
  //     Alert.alert("Cant pick this date");
  //   } else {
  //     console.log("locale string:");
  //     console.log(date.toLocaleString());
  //   }
  // };
  // const mf = () => {
  //   console.log("myfun");
  // };

  // const myo = {
  //   myfunction: mf(),
  // };

  const startSharingPosition = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Warning", "Permission to access location was denied");
      return;
    }
    //console.log(`pemission is : ${hasPermission}`);
    //console.log(hasPermission);

    // Alert.alert("Position Sharing", "Position is being shared");

    try {
      const substcribe = await Location.watchPositionAsync(
        { distanceInterval: 100, accuracy: Location.Accuracy.Low },
        (location) => {
          setLocation(location);
          console.log(`location updated is: ${location.coords.latitude}`);
        }
      );
      setSubscribeLocationUpdate(substcribe);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSharingLocation = async (toggle) => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Warning", "Permission to access location was denied");
      return;
    }

    console.log(toggle);
    if (toggle) {
      try {
        subscribe = await Location.watchPositionAsync(
          { distanceInterval: 100, accuracy: Location.Accuracy.Low },
          (location) => {
            //setLocation(location);
            console.log(`location updated is: ${location.coords.latitude}`);
          }
        );
        // setSubscribeLocationUpdate(subscribe;
        //console.log(subscribe.remove());
        console.log(subscribe);
        // await subscribe.remove;
        //subscribe();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(subscribe.remove);
      if (subscribe !== null) {
        await subscribe.remove;
        console.log("stop sharing");

        // subscribeToLoactionUpdate.remove;
      }

      //subscribe.remove();
    }
  };
  // await Location.watchPositionAsync(
  //     { distanceInterval: 100, accuracy: Location.Accuracy.Low },
  //     (location) => {
  //       setLocation(location);
  //       console.log(`location updated is: ${location.coords.latitude}`);
  //     }
  // ).then(() => {
  //   remove();
  //   })

  return (
    <View>
      <Button title="Start Sharing" onPress={startSharePosition} />
      <Button title="Stop Sharing" onPress={stopSharePostion} />
      <Button
        title="fech user id 3"
        onPress={() => {
          fetchUserInfo(3, "member");
        }}
      />

      <Button
        title="Start Sharing Backgroud"
        onPress={() => {
          Location.hasStartedLocationUpdatesAsync("UpdateLocation")
            .then((res) => {
              if (!res) {
                Location.startLocationUpdatesAsync("UpdateLocation", {
                  accuracy: Location.Accuracy.Low,
                  distanceInterval: 10,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      />
      <Button
        title="go favorate"
        onPress={() => {
          navigation.navigate("GroupManage", { userId: 3 });
        }}
      />

      <Button
        title="Stop Sharing Backgroud"
        onPress={() => {
          Location.hasStartedLocationUpdatesAsync("UpdateLocation").then(
            (res) => {
              if (res) {
                Location.stopLocationUpdatesAsync("UpdateLocation");
              }
            }
          );
        }}
      />
    </View>
  );
};

export default TestScreen;
