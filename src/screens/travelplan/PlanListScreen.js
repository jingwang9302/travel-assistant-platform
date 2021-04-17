import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PLAN_SERVICE, GCS_URL } from "../../config/urls";

import axios from "axios";

import { StyleSheet, View, FlatList, StatusBar, Alert } from "react-native";

import LoginAlertScreen from "../user/LoginAlertScreen";
import PlanItem from "../../components/travelgroup_and_travelplan/PlanItem";

const TravelPlanListScreen = ({ navigation, route }) => {
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
    if (userProfile.isLogin) {
      if (groupId) {
        fetchTravelPlan();
      }
    }
  }, [userProfile]);

  if (!userProfile.isLogin) {
    return <LoginAlertScreen />;
  }

  const fetchTravelPlan = () => {
    setIsRefreshing(true);
    //setPlans([]);
    setLoading(true);
    axios
      .get(PLAN_SERVICE + `read/plans_in/${groupId}`)
      .then((res) => {
        const { data } = res.data;
        setPlans(data);
        setIsRefreshing(false);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setIsRefreshing(false);
        setLoading(false);
        Alert.alert("Alert", `${error.response.data.error}`);
      });
  };

  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item }) => {
    console.log("each plan");
    console.log(item);
    return (
      <PlanItem
        loading={loading}
        estimatedStartDate={item.startDate}
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
