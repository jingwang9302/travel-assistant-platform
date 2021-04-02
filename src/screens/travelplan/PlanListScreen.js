import React, { createRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GROUP_SERVICE, PLAN_SERVICE } from "../../config/urls";
import { UPDATE_ERRORS, CLEAR_ERRORS } from "../../redux/actions/errorAction";
import axios from "axios";
import {
  getGroupsUserIn,
  GET_SINGLE_GROUP_BY_ID,
} from "../../redux/actions/travelgroupAction";
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
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import { USER_SERVICE } from "../../config/urls";
import Loader from "../../components/Loader";
import {
  Icon,
  Input,
  Button,
  ListItem,
  Avatar,
  SearchBar,
  Card,
  Badge,
} from "react-native-elements";
import {
  UPDATE_GROUPS,
  SET_CURRENTGROUP,
} from "../../redux/actions/travelgroupAction";
import { GROUP_DATA, PlAN_DATA } from "../travelgroup/Data";
import LoginAlertScreen from "../user/LoginAlertScreen";
import PlanItem from "../../components/travelgroup_and_travelplan/PlanItem";

const TravelPlanListScreen = ({ navigation, route }) => {
  //const errorMessage = useSelector((state) => state.error);
  //const [errorMessage, setErrorMessage] = useState("");
  const [plans, setPlans] = useState([]);

  //for test
  const [likesValue, setlikesValue] = useState(4);
  const [dislikesValue, setDislikesValue] = useState(4);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userProfile = useSelector((state) => state.user);

  const planStatus = ["Created", "Published", "Ongoing", "Ended"];
  const { groupId } = route.params;

  useEffect(() => {
    //setLoad
    //console.log(groupId);
    if (groupId) {
      fetchTravelPlan();
    }
  }, []);

  if (!userProfile.isLogin) {
    return <LoginAlertScreen />;
  }

  const fetchTravelPlan = () => {
    setIsRefreshing(true);
    axios
      .get(PLAN_SERVICE + `read/plans_in/${groupId}`)
      .then((res) => {
        const { data } = res.data;

        console.log("plans fetched");
        console.log(data);
        setPlans(data);
        //setLoading(false);
        setIsRefreshing(false);
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setIsRefreshing(false);
        //setLoading(false);
        Alert.alert("Failed!", `${error.response.data.error}`);
        //setErrorMessage(error.response.data.error);
      });
  };

  // const fechTravelPlanOfInitiator = () => {
  //   setIsRefreshing(true);
  //   axios
  //     .get(PLAN_SERVICE + `read/plans_createdby/${userProfile.id}`)
  //     .then((res) => {
  //       const { data } = res.data;

  //       console.log("plans fetched");
  //       console.log(data);
  //       setPlans(data);
  //       //setLoading(false);
  //       setIsRefreshing(false);
  //     })
  //     .catch((error) => {
  //       console.log(error.response.data.error);
  //       setIsRefreshing(false);
  //       //setLoading(false);
  //       Alert.alert("Failed!", `${error.response.data.error}`);
  //       //setErrorMessage(error.response.data.error);
  //     });
  // };

  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item }) => {
    console.log("each plan");
    console.log(item);
    return (
      <PlanItem
        loading={loading}
        imageUrl={item.image}
        name={item.planName}
        description={item.planDescription}
        status={planStatus[item.status]}
        likes={item.likes.length}
        dislikes={item.dislikes.length}
        onSelect={() => {
          navigation.navigate("PlanDetail", {
            planId: item._id,
          });
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {plans && plans.length > 0 ? (
        <FlatList
          onRefresh={() => {
            if (groupId) {
              fetchTravelPlan();
            }
          }}
          refreshing={isRefreshing}
          data={plans}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  SectionStyle: {
    marginTop: 5,
    marginBottom: 10,
    margin: 5,
  },
  likesAndDislikesButtonContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 6,
    justifyContent: "space-between",
  },
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
    fontSize: 25,
  },
  itemSubtitle: {
    color: "black",
    fontSize: 15,

    marginVertical: 10,
  },
});

export default TravelPlanListScreen;
