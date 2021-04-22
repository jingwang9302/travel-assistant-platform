import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StackActions } from "@react-navigation/routers";
import { Icon, Button } from "react-native-elements";

import PlanDetailScreen from "../screens/travelplan/PlanDetailScreen";
import CreateNewPlanScreen from "../screens/travelplan/CreateNewPlanScreen";
import PlacePickScreen from "../screens/travelplan/PlacePickScreen";
import MapScreen from "../screens/travelplan/MapScreen";
import EditPlanScreen from "../screens/travelplan/EditPlanScreen";
import GroupListForPlanPublishScreen from "../screens/travelgroup/GroupListForPlanPublishScreen";
import TestScreen from "../screens/travelplan/test";
import TravelPlanListTabScreen from "../screens/travelplan/PlanListTabScreen";
import GroupManageScreen from "../screens/travelgroup/GroupManageScreen";
import NavigationScreen from "../screens/maps/NavigationScreen";

const TravelplanStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="PlanListTab">
      <Stack.Screen
        name="PlanListTab"
        component={TravelPlanListTabScreen}
        options={{ title: "Your Plans" }}
      />
      <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
      <Stack.Screen
        name="PlanPublish"
        component={GroupListForPlanPublishScreen}
      />
      <Stack.Screen name="PlanEdit" component={EditPlanScreen} />
      <Stack.Screen
        name="PlanCreate"
        component={CreateNewPlanScreen}
        options={{ title: "New Plan" }}
      />
      <Stack.Screen
        name="PlacePick"
        component={PlacePickScreen}
        options={{ title: "Add a Place" }}
      />
      <Stack.Screen
        name="MapForPlacePick"
        component={MapScreen}
        options={{ title: "Map" }}
      />
      <Stack.Screen name="Test" component={TestScreen} />
      <Stack.Screen name="GroupManage" component={GroupManageScreen} />
    </Stack.Navigator>
  );
};

export default TravelplanStack;
