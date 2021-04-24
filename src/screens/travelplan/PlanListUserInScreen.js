import React, { createRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GROUP_SERVICE, PLAN_SERVICE } from "../../config/urls";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";

import axios from "axios";

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  Alert,
} from "react-native";

import { Icon, Badge } from "react-native-elements";

import { clearPlans } from "../../redux/actions/travelPlanAction";

import LoginAlertScreen from "../user/LoginAlertScreen";
import PlanItem from "../../components/travelgroup_and_travelplan/PlanItem";
import { Ionicons } from "@expo/vector-icons";

const PlanListUserInScreen = ({ navigation, route }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userProfile = useSelector((state) => state.user);
  const { ongoingPlan } = useSelector((state) => state.plans);
  const [errorMessage, setErrorMessage] = useState("");

  const planStatus = ["Created", "Published", "Ongoing", "Ended"];
  const isFocused = navigation.isFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userProfile.isLogin) {
      fechTravelPlanUserIn();
    } else {
      dispatch(clearPlans());
    }
  }, [userProfile.isLogin, isFocused]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <OverflowMenu
            style={{ marginHorizontal: 5 }}
            OverflowIcon={() => <Icon name="menu" size={30} />}
          >
            {/* <HiddenItem
              title="Create a Plan"
              onPress={() => {
                navigation.navigate("PlanCreate");
              }}
            /> */}
            <HiddenItem
              title="Plans You Created"
              onPress={() => {
                navigation.navigate("PlanListUserCreated");
              }}
            />
            <HiddenItem
              title="Plans You finished"
              onPress={() => {
                navigation.navigate("User", { screen: "TravelReviewHome" });
                //navigation.navigate("TravelReviewHome");
              }}
            />
          </OverflowMenu>

          {ongoingPlan ? (
            <Item
              iconName="airplane-outline"
              onPress={() => {
                navigation.navigate("PlanDetail", { planId: ongoingPlan });
              }}
            />
          ) : null}
        </HeaderButtons>
      ),
    });
  }, [ongoingPlan]);

  const IoniconsHeaderButton = (props) => (
    <HeaderButton IconComponent={Ionicons} iconSize={23} {...props} />
  );

  if (!userProfile.isLogin) {
    return <LoginAlertScreen />;
  }

  // fetch travel plans that user doesn't finish
  const fechTravelPlanUserIn = () => {
    setPlans([]);
    setLoading(true);
    setIsRefreshing(true);
    setErrorMessage("");
    axios
      .get(PLAN_SERVICE + `read_unfinished/${userProfile.id}`)
      .then((res) => {
        const { data } = res.data;
        setPlans(data);
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch((error) => {
        console.log(error.response.data.error);
        setIsRefreshing(false);
        setLoading(false);
        if (error.response.status === 404) {
          const message = "You don't have any unfinished travel plans";
          setErrorMessage(message);
        } else {
          Alert.alert("Alert", `${error.response.data.error}`);
        }
      });
  };

  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({ item }) => {
    return (
      <PlanItem
        loading={loading}
        imageUrl={item.image}
        name={item.planName}
        description={item.planDescription}
        status={planStatus[item.status]}
        likes={item.likes.length}
        dislikes={item.dislikes.length}
        estimatedStartDate={item.startDate}
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
      <View>
        {errorMessage ? (
          <Text style={{ fontSize: 25 }}>{errorMessage}</Text>
        ) : null}
      </View>
      {plans && plans.length > 0 ? (
        <FlatList
          onRefresh={() => {
            fechTravelPlanUserIn();
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

export default PlanListUserInScreen;
